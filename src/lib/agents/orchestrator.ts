import { agentRegistry } from './registry';
import { AiContext } from '../ai/context';
import { AgentResult } from '../ai/schemas';

export interface OrchestratorResult {
    executionId: string;
    startedAt: string;
    finishedAt: string;
    durationMs: number;
    results: AgentResult[];
}

export class AgentOrchestrator {
    async runPipeline(context: AiContext): Promise<OrchestratorResult> {
        const startedAt = new Date().toISOString();
        const startMs = Date.now();
        console.log(`[Orchestrator] Starting Execution ID: ${context.executionId}`);

        const agentsToRun = [];
        const skippedAgents: string[] = [];

        // Determine which agents can run based on input availability
        const whitepaperData = context.collectedData.whitepaper;
        const whitepaperAgent = agentRegistry.getAgent('WhitepaperAgent');
        if (whitepaperAgent && whitepaperData?.status === 'success' && whitepaperData.data) {
            agentsToRun.push(whitepaperAgent);
        } else {
            skippedAgents.push('WhitepaperAgent');
        }

        const githubData = context.collectedData.github;
        const githubAgent = agentRegistry.getAgent('GitHubAgent');
        if (githubAgent && githubData?.status === 'success' && githubData.data) {
            agentsToRun.push(githubAgent);
        } else {
            skippedAgents.push('GitHubAgent');
        }

        const docsData = context.collectedData.documentation;
        const docsAgent = agentRegistry.getAgent('DocumentationAgent');
        if (docsAgent && docsData?.status === 'success' && docsData.data) {
            agentsToRun.push(docsAgent);
        } else {
            skippedAgents.push('DocumentationAgent');
        }

        console.log(`[Orchestrator] Execution order / Eligible Agents: ${agentsToRun.map(a => a.name).join(', ')}`);
        if (skippedAgents.length > 0) {
            console.log(`[Orchestrator] Skipped Agents: ${skippedAgents.join(', ')}`);
        }

        // Run independent agents in parallel seamlessly
        const promises = agentsToRun.map(async (agent) => {
            try {
                // BaseAgent internally handles its own LLM errors, returning { data: null } if unrecoverable
                const { data, log } = await agent.execute(undefined, context);

                if (data === null) {
                    console.error(`[Orchestrator] ${agent.name} failed during LLM execution: ${log.failureReason}`);
                    // Reconstruct into a valid failed AgentResult schema keeping the failure result
                    return {
                        status: 'failed',
                        error: log.failureReason || `Unknown execution failure in ${agent.name}`,
                        summary: null,
                        findings: null,
                        evidence: null,
                        sources: null,
                        confidence: null,
                        executionMetadata: {
                            agentName: agent.name,
                            durationMs: log.durationMs,
                            qualityScores: null
                        }
                    } as AgentResult;
                }

                return data as AgentResult;
            } catch (error) {
                // Catch any structural uncaught errors bubbling out of the agent boundary
                console.error(`[Orchestrator] ${agent.name} threw a fatal error:`, error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                return {
                    status: 'failed',
                    error: `Fatal Exception: ${errorMessage}`,
                    summary: null,
                    findings: null,
                    evidence: null,
                    sources: null,
                    confidence: null,
                    executionMetadata: {
                        agentName: agent.name,
                        qualityScores: null
                    }
                } as AgentResult;
            }
        });

        // Collect every AgentResult
        const agentResults = await Promise.all(promises);

        const failedAgents = agentResults
            .filter(r => r.status === 'failed')
            .map(r => r.executionMetadata.agentName);

        if (failedAgents.length > 0) {
            console.log(`[Orchestrator] Failed Agents logged in pipeline context: ${failedAgents.join(', ')}`);
        }

        const finishedAt = new Date().toISOString();
        const durationMs = Date.now() - startMs;
        console.log(`[Orchestrator] Completed Execution ID: ${context.executionId} in ${durationMs}ms`);

        return {
            executionId: context.executionId,
            startedAt,
            finishedAt,
            durationMs,
            results: agentResults
        };
    }
}
