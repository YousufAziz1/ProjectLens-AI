import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitVerification } from '../contract';
import { GenLayerVerificationStatus, ProjectEvidence } from '../types';

let mockTxStatus = 0;
let mockWriteContract = vi.fn();
let mockGetTransaction = vi.fn();
let mockGetTransactionReceipt = vi.fn();

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

describe('GenLayer Polling Lifecycle', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        mockWriteContract.mockResolvedValue('0xabc');
        mockGetTransaction.mockImplementation(async () => ({ status: mockTxStatus }));
        mockGetTransactionReceipt.mockResolvedValue({ txExecutionResultName: 'SUCCESS' });
    });

    it('should successfully finalize immediately if tx reaches finalized', async () => {
        mockTxStatus = 5; // FINALIZED
        const result = await submitVerification(mockEvidence);
        expect(result.status).toBe(GenLayerVerificationStatus.VERIFIED);
        expect(result.transactionHash).toBe('0xabc');
        expect(result.result?.trust_score).toBe(95);
    });

    it('should return FAILED if execution result is FINISHED_WITH_ERROR', async () => {
        mockTxStatus = 5; // FINALIZED
        mockGetTransactionReceipt.mockResolvedValueOnce({ txExecutionResultName: 'FINISHED_WITH_ERROR' });

        const result = await submitVerification(mockEvidence);
        expect(result.status).toBe(GenLayerVerificationStatus.FAILED);
        expect(result.error).toContain('failed during consensus');
    });
});
