import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitVerification, fetchVerificationStatus } from '../contract';
import { GenLayerVerificationStatus, ProjectEvidence } from '../types';

let mockTxStatus: string | undefined = 'PENDING';
const mockWriteContract = vi.fn();
const mockGetTransaction = vi.fn();
const mockGetTransactionReceipt = vi.fn();
const mockReadContract = vi.fn();

// Mock GenLayer Client Config
vi.mock('../client', () => ({
    getNetwork: () => 'simulator',
    getContractAddress: () => '0x123',
    isGenLayerConfigured: () => true,
    createGenLayerClient: () => ({
        client: {
            writeContract: (...args: unknown[]) => mockWriteContract(...args),
            getTransaction: (...args: unknown[]) => mockGetTransaction(...args),
            getTransactionReceipt: (...args: unknown[]) => mockGetTransactionReceipt(...args)
        }
    }),
    createGenLayerReadClient: () => ({
        client: {
            readContract: (...args: unknown[]) => mockReadContract(...args)
        }
    })
}));

const mockEvidence: ProjectEvidence = {
    target_url: 'test',
    github_url: null,
    documentation_url: null,
    repository_metrics: null,
    security_findings: [],
    documentation_findings: null,
    deterministic_scores: { security_score: 0, repository_score: 0, documentation_score: 0, transparency_score: 0, overall_score: 0 },
    evidence_count: 0,
    analysis_timestamp: new Date().toISOString(),
};

describe('GenLayer Stateless Submissions', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        mockWriteContract.mockResolvedValue('0xabc');
        mockGetTransaction.mockImplementation(async () => ({ status: mockTxStatus }));
        mockGetTransactionReceipt.mockResolvedValue({ txExecutionResultName: 'SUCCESS' });
        mockReadContract.mockResolvedValue(JSON.stringify({ trust_score: 95, risk_level: 'low', decision: 'recommended', rationale: 'default' }));
    });

    it('submitVerification should return PENDING implicitly with a valid hash', async () => {
        const result = await submitVerification(mockEvidence);
        expect(result.status).toBe(GenLayerVerificationStatus.PENDING);
        expect(result.transactionHash).toBe('0xabc');
    });

    it('fetchVerificationStatus should NOT treat ACCEPTED as FINALIZED', async () => {
        mockTxStatus = 'ACCEPTED';
        const result = await fetchVerificationStatus('0xabc');
        expect(result.status).toBe(GenLayerVerificationStatus.EXECUTING);
    });

    it('fetchVerificationStatus should return VERIFIED when FINALIZED succeeds', async () => {
        mockTxStatus = 'FINALIZED';
        const result = await fetchVerificationStatus('0xabc');
        expect(result.status).toBe(GenLayerVerificationStatus.VERIFIED);
        expect(result.result?.trust_score).toBe(95);
    });

    it('fetchVerificationStatus should return FAILED if FINALIZED executes with FINISHED_WITH_ERROR', async () => {
        mockTxStatus = 'FINALIZED';
        mockGetTransactionReceipt.mockResolvedValueOnce({ txExecutionResultName: 'FINISHED_WITH_ERROR' });

        const result = await fetchVerificationStatus('0xabc');
        expect(result.status).toBe(GenLayerVerificationStatus.FAILED);
        expect(result.error).toContain('FINISHED_WITH_ERROR');
    });

    it('fetchVerificationStatus should gracefully drop into PENDING during momentary indexing failure', async () => {
        mockTxStatus = undefined;
        mockGetTransaction.mockRejectedValueOnce(new Error("indexing not ready"));

        const result = await fetchVerificationStatus('0xabc');
        expect(result.status).toBe(GenLayerVerificationStatus.PENDING);
    });

    it('fetchVerificationStatus should return FAILED for malformed JSON results (invalid string)', async () => {
        mockTxStatus = 'FINALIZED';
        mockGetTransactionReceipt.mockResolvedValueOnce({ txExecutionResultName: 'SUCCESS' });
        mockReadContract.mockResolvedValueOnce('INVALID JSON STR');

        const result = await fetchVerificationStatus('0xabc');
        expect(result.status).toBe(GenLayerVerificationStatus.FAILED);
        expect(result.error).toContain('CONTRACT_RESULT_INVALID');
    });

    it('fetchVerificationStatus should return FAILED for empty JSON object {}', async () => {
        mockTxStatus = 'FINALIZED';
        mockGetTransactionReceipt.mockResolvedValueOnce({ txExecutionResultName: 'SUCCESS' });
        mockReadContract.mockResolvedValueOnce(JSON.stringify({}));

        const result = await fetchVerificationStatus('0xabc');
        expect(result.status).toBe(GenLayerVerificationStatus.FAILED);
        expect(result.error).toContain('CONTRACT_RESULT_INVALID');
    });

    it('fetchVerificationStatus should return FAILED for missing essential parsed properties', async () => {
        mockTxStatus = 'FINALIZED';
        mockGetTransactionReceipt.mockResolvedValueOnce({ txExecutionResultName: 'SUCCESS' });
        mockReadContract.mockResolvedValueOnce(JSON.stringify({
            trust_score: 95,
            // MISSING risk_level, decision, rationale
        }));

        const result = await fetchVerificationStatus('0xabc');
        expect(result.status).toBe(GenLayerVerificationStatus.FAILED);
        expect(result.error).toContain('CONTRACT_RESULT_INVALID');
    });
});
