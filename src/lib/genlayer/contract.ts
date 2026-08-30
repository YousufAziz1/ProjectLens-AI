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

/** Removed old timeout as polling is now decentralized */

/**
 * Submit project evidence to the GenLayer TrustLensVerifier contract
 * and wait for the consensus-verified result.
 */
export async function submitVerification(
    evidence: ProjectEvidence
): Promise<GenLayerVerificationResponse> {
    const network = getNetwork();
    const contractAddress = getContractAddress();

    if (!isGenLayerConfigured() || !contractAddress) {
        return {
            status: GenLayerVerificationStatus.UNAVAILABLE,
            result: null,
            transactionHash: null,
            contractAddress: null,
            executionTimestamp: null,
            error: 'GenLayer contract not configured.',
            network,
        };
    }

    try {
        const { client } = createGenLayerClient();
        const evidenceJson = JSON.stringify(evidence);

        const transactionHash = await client.writeContract({
            address: contractAddress as `0x${string}`,
            functionName: 'verify_project',
            args: [evidenceJson],
            value: BigInt(0),
        });

        return {
            status: GenLayerVerificationStatus.PENDING,
            result: null,
            transactionHash: transactionHash as string,
            contractAddress,
            executionTimestamp: new Date().toISOString(),
            error: null,
            network,
        };
    } catch (error) {
        return {
            status: GenLayerVerificationStatus.FAILED,
            result: null,
            transactionHash: null,
            contractAddress,
            executionTimestamp: new Date().toISOString(),
            error: `Submission error: ${error instanceof Error ? error.message : String(error)}`,
            network,
        };
    }
}

export async function fetchVerificationStatus(transactionHash: string): Promise<GenLayerVerificationResponse> {
    const network = getNetwork();
    const contractAddress = getContractAddress();

    try {
        const { client } = createGenLayerClient();
        const tx = await client.getTransaction({ hash: transactionHash as any });
        let rawStatus = tx?.status as unknown as number | undefined;

        let statusName = 'PENDING';
        if (rawStatus === 5 /* ACCEPTED */) {
            statusName = 'ACCEPTED';
        } else if (rawStatus === 7 /* FINALIZED */) {
            statusName = 'FINALIZED';
        } else if (rawStatus !== undefined) {
            const names = ['PENDING', 'PROPOSING', 'COMMITTING', 'REVEALING', 'ACCEPTED', 'FINALIZED', 'UNDETERMINED'];
            statusName = names[rawStatus] || `STATUS_${rawStatus}`;
        }

        if (rawStatus === undefined) {
            rawStatus = 0; // Default pending if indexing delayed
        }

        if (statusName === 'UNDETERMINED') {
            return {
                status: GenLayerVerificationStatus.FAILED,
                result: null,
                transactionHash,
                contractAddress,
                executionTimestamp: new Date().toISOString(),
                error: 'Transaction reached UNDETERMINED state.',
                network,
            };
        }

        // Must explicitly wait for actual FINALIZED (7)
        if (rawStatus !== 7 && statusName !== 'FINALIZED') {
            return {
                status: GenLayerVerificationStatus.EXECUTING, // generic in-progress mapped status
                result: null,
                transactionHash,
                contractAddress,
                executionTimestamp: new Date().toISOString(),
                error: null,
                network,
                // Passing raw descriptive state back is helpful, we can piggyback it on the error string temporally or just the UI will see EXECUTING
                // Alternatively, error msg is used for passing strict enum status to UI
                // So let's attach the detailed enum name as the "error" field when it's pending to stream real names:
            };
        }

        // If we reached FINALIZED (7), fetch receipt and inspect execution outcome
        let finalReceipt = null;
        try {
            finalReceipt = await client.getTransactionReceipt({ hash: transactionHash as any });
        } catch (e) {
            // Receipt might lag slightly behind the getTransaction consensus mapping
            return {
                status: GenLayerVerificationStatus.EXECUTING,
                result: null,
                transactionHash,
                contractAddress,
                executionTimestamp: new Date().toISOString(),
                error: null,
                network,
            };
        }

        const execResult = (finalReceipt as Record<string, unknown>)?.txExecutionResultName as string | undefined;

        if (execResult === 'FINISHED_WITH_ERROR') {
            return {
                status: GenLayerVerificationStatus.FAILED,
                result: null,
                transactionHash,
                contractAddress,
                executionTimestamp: new Date().toISOString(),
                error: 'GenLayer contract execution failed with FINISHED_WITH_ERROR.',
                network,
            };
        }

        // Transaction successfully finalized, now read the updated intelligent contract verification state
        const { client: readClient } = createGenLayerReadClient();
        const rawResult = await readClient.readContract({
            address: contractAddress as `0x${string}`,
            functionName: 'get_latest_verification',
            args: [],
        });

        return {
            status: GenLayerVerificationStatus.VERIFIED,
            result: parseVerificationResult(rawResult),
            transactionHash,
            contractAddress,
            executionTimestamp: new Date().toISOString(),
            error: null,
            network,
        };

    } catch (err) {
        // If indexing temporarily fails or network blips, return pending so frontend continues polling
        return {
            status: GenLayerVerificationStatus.PENDING,
            result: null,
            transactionHash,
            contractAddress,
            executionTimestamp: new Date().toISOString(),
            error: null,
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
