/**
 * Evidence Builder — transforms the existing TrustLens pipeline output
 * into structured ProjectEvidence for GenLayer contract submission.
 */
import type { ProjectEvidence } from './types';
import type { FinalReport } from '../ai/schemas';
import type { UnifiedCollectorOutput } from '@/types';

/**
 * Build a ProjectEvidence object from the existing pipeline outputs.
 * This bridges the gap between the existing scoring engine and GenLayer.
 */
export function buildProjectEvidence(
    report: FinalReport,
    collectedData: UnifiedCollectorOutput,
    input: { websiteUrl?: string; githubUrl?: string; docsUrl?: string }
): ProjectEvidence {
    const github = collectedData?.github?.data;

    // Security Findings from FinalReport
    const securityFindings = [
        ...(report.securityPenalties || []).map(penalty => ({
            severity: penalty.penalty > 20 ? 'high' : penalty.penalty > 10 ? 'medium' : 'low',
            title: sanitizeString(penalty.reason.slice(0, 50)),
            description: sanitizeString(penalty.reason)
        })),
        ...(report.weaknesses || []).map(weakness => ({
            severity: 'medium',
            title: 'Reported Weakness',
            description: sanitizeString(weakness)
        }))
    ].slice(0, 10);

    // Build repository metrics from github.data
    const repositoryMetrics = github ? {
        stars: github.stars || 0,
        forks: github.forks || 0,
        open_issues: github.openIssues || 0,
        recent_commits: github.recentCommits?.length || 0,
        contributors: github.contributorsCount || 0,
        has_license: !!github.license,
        primary_language: 'unknown', // github data does not have primaryLanguage natively
    } : null;

    // Build documentation findings from extracted facts
    const facts = report.extractedFacts;
    const documentationFindings = facts ? {
        quality: report.categoryScores.documentation > 75 ? 'adequate' : 'insufficient',
        sections_found: (facts.docSections || []).map(sanitizeString),
        sections_missing: (facts.missingDocSections || []).map(sanitizeString),
    } : null;

    // Extract category scores directly from proper Report map
    const categoryScores = report.categoryScores || { security: 0, repository: 0, documentation: 0, transparency: 0, tokenomics: 0 };
    const deterministicScores = {
        security_score: categoryScores.security || 0,
        repository_score: categoryScores.repository || 0,
        documentation_score: categoryScores.documentation || 0,
        transparency_score: categoryScores.transparency || 0,
        // @ts-ignore - score exists on the compiled output before we typed it strictly, using fallback
        overall_score: (report as any).score || (report.categoryScores ? Math.round((categoryScores.security * 0.4) + (categoryScores.repository * 0.25) + (categoryScores.documentation * 0.2) + (categoryScores.transparency * 0.1) + (categoryScores.tokenomics * 0.05)) : 0),
    };

    return {
        target_url: input.websiteUrl || input.githubUrl || 'unknown',
        github_url: input.githubUrl || null,
        documentation_url: input.docsUrl || null,
        repository_metrics: repositoryMetrics,
        security_findings: securityFindings,
        documentation_findings: documentationFindings,
        deterministic_scores: deterministicScores,
        evidence_count: countEvidence(collectedData, report),
        analysis_timestamp: new Date().toISOString(),
    };
}

/**
 * Count the total number of evidence items collected.
 */
function countEvidence(collectedData: UnifiedCollectorOutput, report: FinalReport): number {
    let count = 0;
    if (collectedData?.github?.status === 'success') count += 1;
    if (collectedData?.documentation?.status === 'success') count += 1;
    if (collectedData?.website?.status === 'success') count += 1;
    if (report.securityPenalties?.length) count += report.securityPenalties.length;
    if (report.evidence?.length) count += report.evidence.length;
    if (report.extractedFacts?.ecosystemIntegrations?.length) count += report.extractedFacts.ecosystemIntegrations.length;
    return count;
}

/**
 * Sanitize a string to prevent prompt injection from untrusted scraped content.
 * Strips control characters and limits length.
 */
function sanitizeString(input: string): string {
    return input
        .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
        .replace(/```/g, '')              // Remove markdown code blocks
        .trim()
        .slice(0, 500);
}
