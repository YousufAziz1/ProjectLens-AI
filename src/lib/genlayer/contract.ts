/**
 * GenLayer Intelligent Contract interaction layer.
 * 
 * Handles submitting evidence to the TrustLensVerifier contract,
 * waiting for consensus, and parsing the verification result.
 */
import { createGenLayerClient, createGenLayerReadClient, getContractAddress, getNetwork, isGenLayerConfigured } from './client';
import type { ProjectEvidence, VerificationResult, GenLayerVerificationResponse } from './types';
import { GenLayerVerificationStatus } from './types';
import { TransactionStatus } from 'genlayer-js/types';

/** Timeout for waiting on GenLayer transaction finalization (120 seconds) */
const VERIFICATION_TIMEOUT_MS = 120_000;

/**
 * Submit project evidence to the GenLayer TrustLensVerifier contract
 * and wait for the consensus-verified result.
 */
export async function submitVerification(
    evidence: ProjectEvidence,
    onProgress?: (status: string, txHash?: string) => void
): Promise<GenLayerVerificationResponse> {
    const network = getNetwork();
    const contractAddress = getContractAddress();

    // Check if GenLayer is configured
    if (!isGenLayerConfigured() || !contractAddress) {
        return {
            status: GenLayerVerificationStatus.UNAVAILABLE,
            result: null,
            transactionHash: null,
            contractAddress: null,
            executionTimestamp: null,
            error: 'GenLayer contract address not configured. Set GENLAYER_CONTRACT_ADDRESS in environment.',
            network,
        };
    }

    try {
        // Create a signing client for write transactions
        const { client } = createGenLayerClient();

        // Serialize evidence into the format expected by the contract
        const evidenceJson = JSON.stringify(evidence);

        // Submit the verification transaction
        const transactionHash = await client.writeContract({
            address: contractAddress as `0x${string}`,
            functionName: 'verify_project',
            args: [evidenceJson],
            value: BigInt(0),
        });

        if (onProgress) {
            onProgress('SUBMITTED', transactionHash);
        }

        // Wait for the transaction to be finalized by consensus using polling
        const startTime = Date.now();
        let finalReceipt = null;

        while (true) {
            try {
                const tx = await client.getTransaction({ hash: transactionHash });
                const currentStatus = tx?.status;

                let statusName = 'PENDING';
                if (currentStatus !== undefined && currentStatus !== null) {
                    if (typeof currentStatus === 'string') {
                        statusName = currentStatus;
                    } else if (typeof currentStatus === 'number') {
                        const names = ['PENDING', 'PROPOSING', 'COMMITTING', 'REVEALING', 'ACCEPTED', 'FINALIZED', 'UNDETERMINED'];
                        statusName = names[currentStatus] || `STATUS_${currentStatus}`;
                    }
                }

                if (onProgress) {
                    onProgress(statusName.toUpperCase(), transactionHash);
                }

                if (currentStatus === TransactionStatus.FINALIZED || statusName.toUpperCase() === 'FINALIZED') {
                    // Try to get receipt when finalized
                    try {
                        finalReceipt = await client.getTransactionReceipt({ hash: transactionHash });
                    } catch (e) {
                        // ignore and it might fetch on next loop if race condition
                    }
                    if (finalReceipt) break;
                }

                if (statusName.toUpperCase() === 'UNDETERMINED') {
                    throw new Error('Transaction reached UNDETERMINED consensus state.');
                }
            } catch (err) {
                // If getTransaction throws (e.g. indexing delay), safely ignore and wait
                // Unless we matched UNDETERMINED
                if (err instanceof Error && err.message.includes('UNDETERMINED')) throw err;
            }

            if (Date.now() - startTime > VERIFICATION_TIMEOUT_MS) {
                // Timeout reached, expose as pending instead of throwing a false failure
                return {
                    status: GenLayerVerificationStatus.PENDING,
                    result: null,
                    transactionHash: transactionHash as string,
                    contractAddress,
                    executionTimestamp: new Date().toISOString(),
                    error: null,
                    network,
                };
            }

            await new Promise(r => setTimeout(r, 4000));
        }

        // Check execution result
        const execResult = (finalReceipt as Record<string, unknown>)?.txExecutionResultName as string | undefined;

        if (execResult === 'FINISHED_WITH_ERROR') {
            return {
                status: GenLayerVerificationStatus.FAILED,
                result: null,
                transactionHash: transactionHash as string,
                contractAddress,
                executionTimestamp: new Date().toISOString(),
                error: 'GenLayer contract execution failed during consensus.',
                network,
            };
        }

        // Read the verification result from contract state
        const { client: readClient } = createGenLayerReadClient();
        const rawResult = await readClient.readContract({
            address: contractAddress as `0x${string}`,
            functionName: 'get_latest_verification',
            args: [],
        });

        // Parse the result
        const verificationResult = parseVerificationResult(rawResult);

        return {
            status: GenLayerVerificationStatus.VERIFIED,
            result: verificationResult,
            transactionHash: transactionHash as string,
            contractAddress,
            executionTimestamp: new Date().toISOString(),
            error: null,
            network,
        };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        return {
            status: GenLayerVerificationStatus.FAILED,
            result: null,
            transactionHash: null,
            contractAddress,
            executionTimestamp: new Date().toISOString(),
            error: `GenLayer verification error: ${errorMessage}`,
            network,
        };
    }
}

/**
 * Parse raw contract output into a typed VerificationResult.
 * Handles both JSON string and object responses from the contract.
 */
function parseVerificationResult(rawResult: unknown): VerificationResult {
    let parsed: Record<string, unknown>;

    if (typeof rawResult === 'string') {
        try {
            parsed = JSON.parse(rawResult);
        } catch {
            // If parsing fails, create a default result
            return createDefaultResult('Failed to parse contract response');
        }
    } else if (typeof rawResult === 'object' && rawResult !== null) {
        parsed = rawResult as Record<string, unknown>;
    } else {
        return createDefaultResult('Unexpected contract response format');
    }

    // Validate and extract fields with safe defaults
    return {
        trust_score: clampScore(Number(parsed.trust_score) || 0),
        risk_level: validateRiskLevel(String(parsed.risk_level || 'medium')),
        decision: validateDecision(String(parsed.decision || 'caution')),
        key_findings: Array.isArray(parsed.key_findings)
            ? parsed.key_findings.map(String)
            : [],
        evidence_quality: validateEvidenceQuality(String(parsed.evidence_quality || 'partial')),
        rationale: String(parsed.rationale || 'No rationale provided by contract.'),
        verification_timestamp: String(parsed.verification_timestamp || new Date().toISOString()),
    };
}

function clampScore(score: number): number {
    return Math.max(0, Math.min(100, Math.round(score)));
}

function validateRiskLevel(level: string): VerificationResult['risk_level'] {
    const valid = ['critical', 'high', 'medium', 'low', 'minimal'] as const;
    return valid.includes(level as typeof valid[number])
        ? (level as VerificationResult['risk_level'])
        : 'medium';
}

function validateDecision(decision: string): VerificationResult['decision'] {
    const valid = ['reject', 'caution', 'acceptable', 'recommended'] as const;
    return valid.includes(decision as typeof valid[number])
        ? (decision as VerificationResult['decision'])
        : 'caution';
}

function validateEvidenceQuality(quality: string): VerificationResult['evidence_quality'] {
    const valid = ['insufficient', 'partial', 'adequate', 'comprehensive'] as const;
    return valid.includes(quality as typeof valid[number])
        ? (quality as VerificationResult['evidence_quality'])
        : 'partial';
}

function createDefaultResult(rationale: string): VerificationResult {
    return {
        trust_score: 0,
        risk_level: 'medium',
        decision: 'caution',
        key_findings: [],
        evidence_quality: 'insufficient',
        rationale,
        verification_timestamp: new Date().toISOString(),
    };
}
