// @ts-ignore
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitVerification, fetchVerificationStatus } from '../contract';
import { GenLayerVerificationStatus, ProjectEvidence } from '../types';

let mockTxStatus: number | undefined = 0;
const mockWriteContract = vi.fn();
const mockGetTransaction = vi.fn();
const mockGetTransactionReceipt = vi.fn();

// Mock GenLayer Client Config
vi.mock('../client', () => ({
    getNetwork: () => 'simulator',
    getContractAddress: () => '0x123',
    isGenLayerConfigured: () => true,
    createGenLayerClient: () => ({
        client: {
            writeContract: (...args: any[]) => mockWriteContract(...args),
            getTransaction: (...args: any[]) => mockGetTransaction(...args),
            getTransactionReceipt: (...args: any[]) => mockGetTransactionReceipt(...args)
        }
    }),
    createGenLayerReadClient: () => ({
        client: {
            readContract: vi.fn().mockResolvedValue(JSON.stringify({ trust_score: 95, risk_level: 'low', decision: 'recommended' }))
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
    });

    it('submitVerification should return PENDING implicitly with a valid hash', async () => {
        const result = await submitVerification(mockEvidence);
        expect(result.status).toBe(GenLayerVerificationStatus.PENDING);
        expect(result.transactionHash).toBe('0xabc');
    });

    it('fetchVerificationStatus should NOT treat ACCEPTED (5) as FINALIZED', async () => {
        mockTxStatus = 5; // ACCEPTED
        const result = await fetchVerificationStatus('0xabc');
        expect(result.status).toBe(GenLayerVerificationStatus.EXECUTING);
    });

    it('fetchVerificationStatus should return VERIFIED when FINALIZED (7) succeeds', async () => {
        mockTxStatus = 7; // FINALIZED
        const result = await fetchVerificationStatus('0xabc');
        expect(result.status).toBe(GenLayerVerificationStatus.VERIFIED);
        expect(result.result?.trust_score).toBe(95);
    });

    it('fetchVerificationStatus should return FAILED if FINALIZED (7) executes with FINISHED_WITH_ERROR', async () => {
        mockTxStatus = 7; // FINALIZED
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
});
