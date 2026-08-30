/**
 * Evidence Builder — transforms the existing TrustLens pipeline output
 * into structured ProjectEvidence for GenLayer contract submission.
 */
import type { ProjectEvidence } from './types';

interface ReportData {
    projectName?: string;
    overallScore?: number;
    categoryScores?: Record<string, number>;
    findings?: Array<{
        severity?: string;
        title?: string;
        description?: string;
        type?: string;
    }>;
    ecosystemIntegrations?: Array<{
        name?: string;
        status?: string;
    }>;
    [key: string]: unknown;
}

interface CollectedData {
    github?: {
        stars?: number;
        forks?: number;
        openIssues?: number;
        recentCommits?: number;
        contributors?: number;
        license?: string | null;
        primaryLanguage?: string | null;
        [key: string]: unknown;
    };
    documentation?: {
        quality?: string;
        sectionsFound?: string[];
        sectionsMissing?: string[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

/**
 * Build a ProjectEvidence object from the existing pipeline outputs.
 * This bridges the gap between the existing scoring engine and GenLayer.
 */
export function buildProjectEvidence(
    report: ReportData,
    collectedData: CollectedData,
    input: { websiteUrl?: string; githubUrl?: string; docsUrl?: string }
): ProjectEvidence {
    const github = collectedData?.github;
    const docs = collectedData?.documentation;

    // Extract security findings
    const securityFindings = (report.findings || [])
        .filter(f => f.severity && f.severity !== 'info')
        .slice(0, 10)
        .map(f => ({
            severity: f.severity || 'info',
            title: sanitizeString(f.title || 'Unknown Finding'),
            description: sanitizeString((f.description || '').slice(0, 300)),
        }));

    // Build repository metrics
    const repositoryMetrics = github ? {
        stars: github.stars || 0,
        forks: github.forks || 0,
        open_issues: github.openIssues || 0,
        recent_commits: github.recentCommits || 0,
        contributors: github.contributors || 0,
        has_license: !!github.license,
        primary_language: github.primaryLanguage || null,
    } : null;

    // Build documentation findings
    const documentationFindings = docs ? {
        quality: docs.quality || 'unknown',
        sections_found: (docs.sectionsFound || []).map(sanitizeString),
        sections_missing: (docs.sectionsMissing || []).map(sanitizeString),
    } : null;

    // Extract category scores
    const categoryScores = report.categoryScores || {};
    const deterministicScores = {
        security_score: categoryScores.security || 0,
        repository_score: categoryScores.repository || 0,
        documentation_score: categoryScores.documentation || 0,
        transparency_score: categoryScores.transparency || 0,
        overall_score: report.overallScore || 0,
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
function countEvidence(collectedData: CollectedData, report: ReportData): number {
    let count = 0;
    if (collectedData?.github) count += 1;
    if (collectedData?.documentation) count += 1;
    if (report.findings) count += report.findings.length;
    if (report.ecosystemIntegrations) count += report.ecosystemIntegrations.length;
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
