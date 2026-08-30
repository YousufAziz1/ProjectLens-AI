import { NextResponse } from 'next/server';
import { runUnifiedCollection } from '@/lib/collectors/orchestrator';
import { storage } from '@/lib/storage';
import { UnifiedCollectorInput, UnifiedCollectorOutput } from '@/types';
import { AgentOrchestrator } from '@/lib/agents/orchestrator';
import { ResultNormalizer } from '@/lib/agents/result-normalizer';
import { MasterReportAgent } from '@/lib/agents/master-report-agent';
import { submitVerification, isGenLayerConfigured, GenLayerVerificationStatus } from '@/lib/genlayer';
import { buildProjectEvidence } from '@/lib/genlayer/evidence-builder';

export const maxDuration = 60; // Max execution time for Vercel functions (60 seconds)

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const websiteUrl = formData.get('websiteUrl') as string | null;
        const docsUrl = formData.get('docsUrl') as string | null;
        const githubUrl = formData.get('githubUrl') as string | null;
        const whitepaperFile = formData.get('whitepaperPdf') as File | null;

        let whitepaperBuffer: Buffer | undefined;
        if (whitepaperFile && whitepaperFile.size > 0) {
            if (whitepaperFile.type !== 'application/pdf') {
                return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
            }
            if (whitepaperFile.size > 20 * 1024 * 1024) {
                return NextResponse.json({ error: 'File exceeds 20MB limit' }, { status: 400 });
            }

            const arrayBuffer = await whitepaperFile.arrayBuffer();
            whitepaperBuffer = Buffer.from(arrayBuffer);
        }

        // Prepare input
        const input: UnifiedCollectorInput = {
            websiteUrl: websiteUrl || undefined,
            docsUrl: docsUrl || undefined,
            githubUrl: githubUrl || undefined,
            whitepaperBuffer,
        };

        if (!input.websiteUrl && !input.docsUrl && !input.githubUrl && !input.whitepaperBuffer) {
            return NextResponse.json({ error: 'Please provide at least one source' }, { status: 400 });
        }

        const id = crypto.randomUUID();
        const projectName = websiteUrl ? new URL(websiteUrl).hostname : (githubUrl ? new URL(githubUrl).pathname.split('/').pop() || 'Project' : 'Analyzed Project');

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const emit = (stage: string, data?: Record<string, unknown>) => {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ stage, ...data })}\n\n`));
                };

                try {
                    emit("Collecting project data");
                    const collectedData = await runUnifiedCollection(id, input);

                    emit("Parsing documentation");

                    emit("Running Whitepaper Agent");
                    emit("Running GitHub Agent");
                    emit("Running Documentation Agent");
                    const agentOrchestrator = new AgentOrchestrator();
                    const orchestratorResult = await agentOrchestrator.runPipeline({
                        executionId: id,
                        projectId: id,
                        collectedData,
                        startedAt: new Date().toISOString(),
                        previousAgentResults: {}
                    });

                    emit("Normalizing results");
                    const normalizer = new ResultNormalizer();
                    const normalizedResult = normalizer.normalize(orchestratorResult.results);

                    emit("Building final report");
                    const reportAgent = new MasterReportAgent();
                    const finalReport = reportAgent.compileReport(projectName, normalizedResult, collectedData);

                    // Still save locally for non-Vercel dev environments
                    await storage.saveCollection(id, finalReport as unknown as UnifiedCollectorOutput);

                    // === GenLayer Verification Stage ===
                    let genlayerResult = null;

                    if (isGenLayerConfigured()) {
                        emit("GenLayer Verification", { genlayer_status: GenLayerVerificationStatus.SUBMITTING });

                        try {
                            // Build evidence from the pipeline outputs
                            const evidence = buildProjectEvidence(
                                finalReport,
                                collectedData,
                                { websiteUrl: websiteUrl || undefined, githubUrl: githubUrl || undefined, docsUrl: docsUrl || undefined }
                            );

                            emit("GenLayer Consensus", { genlayer_status: GenLayerVerificationStatus.EXECUTING });

                            // Submit to GenLayer contract and wait for consensus
                            genlayerResult = await submitVerification(evidence);

                            if (genlayerResult.status === GenLayerVerificationStatus.VERIFIED) {
                                emit("GenLayer Verified", { genlayer_status: GenLayerVerificationStatus.VERIFIED });
                            } else {
                                emit("GenLayer Verification Failed", {
                                    genlayer_status: genlayerResult.status,
                                    genlayer_error: genlayerResult.error,
                                });
                            }
                        } catch (glError) {
                            const glMsg = glError instanceof Error ? glError.message : String(glError);
                            emit("GenLayer Verification Failed", {
                                genlayer_status: GenLayerVerificationStatus.FAILED,
                                genlayer_error: glMsg,
                            });
                            genlayerResult = {
                                status: GenLayerVerificationStatus.FAILED,
                                result: null,
                                transactionHash: null,
                                contractAddress: null,
                                executionTimestamp: new Date().toISOString(),
                                error: glMsg,
                                network: 'unknown',
                            };
                        }
                    } else {
                        // GenLayer not configured — mark as unavailable
                        genlayerResult = {
                            status: GenLayerVerificationStatus.UNAVAILABLE,
                            result: null,
                            transactionHash: null,
                            contractAddress: null,
                            executionTimestamp: null,
                            error: 'GenLayer not configured',
                            network: 'none',
                        };
                    }

                    emit("Complete");
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        id,
                        success: true,
                        report: finalReport,
                        genlayer: genlayerResult,
                    })}\n\n`));
                    controller.close();
                } catch (err) {
                    const msg = err instanceof Error ? err.message : String(err);
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
            }
        });

    } catch (error) {
        console.error('API Error in /api/analyze:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
