/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { buildProjectEvidence } from '../evidence-builder';
import type { FinalReport } from '../../ai/schemas';
import type { UnifiedCollectorOutput } from '@/types';

describe('Evidence Builder Data Propagation', () => {
    it('should map actual .data values from unified collector output into GenLayer payload', () => {

        // 1. Representative Mock Collector Output
        const mockCollectedData: UnifiedCollectorOutput = {
            id: 'test-execution-1',
            website: null,
            whitepaper: null,
            github: {
                source: 'github',
                status: 'success',
                collectedAt: new Date().toISOString(),
                metadata: { fetchTimeMs: 120 },
                error: null,
                data: {
                    owner: 'testowner',
                    repo: 'testrepo',
                    name: 'testrepo',
                    description: 'test setup',
                    readme: 'hello world',
                    stars: 999,
                    forks: 42,
                    openIssues: 5,
                    license: 'MIT',
                    contributorsCount: 12,
                    releases: 3,
                    lastCommitDate: new Date().toISOString(),
                    recentCommits: [{ sha: '123', author: 'dev', date: 'now', message: 'init' }]
                } // Actual `.data` structure instead of flattened
            },
            documentation: {
                source: 'documentation',
                status: 'success',
                collectedAt: new Date().toISOString(),
                metadata: { fetchTimeMs: 50 },
                error: null,
                data: '# Documentation mapped mock' // Actual `.data` value string
            }
        };

        // 2. Representative Real FinalReport Schema Output
        const mockFinalReport: FinalReport = {
            projectName: 'Test Project',
            generatedAt: new Date().toISOString(),
            sections: [],
            strengths: [],
            weaknesses: ['Reentrancy risk identified in master contract'],
            missingInformation: [],
            disclaimer: 'test',
            categoryScores: {
                security: 82,
                repository: 76,
                documentation: 91,
                transparency: 100,
                tokenomics: 0
            },
            evidenceCoverage: 100,
            securityPenalties: [{ reason: 'Arbitrary execution via proxy', penalty: 25 }],
            extractedFacts: {
                docSections: ['Architecture', 'API'],
                missingDocSections: ['Testing']
            }
        };

        // 3. Adapter Execution
        const evidence = buildProjectEvidence(
            mockFinalReport,
            mockCollectedData,
            { githubUrl: 'https://github.com/testowner/testrepo' }
        );

        // 4. Assert Repository Data (.data values) reached payload intact
        expect(evidence.repository_metrics).not.toBeNull();
        expect(evidence.repository_metrics?.stars).toBe(999);
        expect(evidence.repository_metrics?.forks).toBe(42);

        // 5. Assert Documentation Facts reached payload intact
        expect(evidence.documentation_findings).not.toBeNull();
        expect(evidence.documentation_findings?.quality).toBe('adequate');
        expect(evidence.documentation_findings?.sections_missing).toContain('Testing');

        // 6. Assert Security Penalties reached payload intact
        // High severity due to penalty > 20
        const topSecurityFinding = evidence.security_findings?.[0];
        expect(topSecurityFinding?.severity).toBe('high');
        expect(topSecurityFinding?.description).toContain('Arbitrary execution via proxy');

        // 7. Assert Deterministic Scores reached payload intact
        expect(evidence.deterministic_scores.security_score).toBe(82);
        expect(evidence.deterministic_scores.overall_score).toBeGreaterThan(0);

        // 8. Test accurate evidence count via status check
        // Github(1) + Docs(1) + SecurityPenalties(1) = 3 total valid chunks mapped.
        expect(evidence.evidence_count).toBe(3);
    });
});
