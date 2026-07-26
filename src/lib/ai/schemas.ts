import { z } from 'zod';

/**
 * Shared AI Output Schemas (Phase 4B)
 * Used by all future AI Agents to return strongly typed JSON objects via structured output.
 */

export const FindingSchema = z.object({
    id: z.string().describe('Unique identifier for this finding'),
    title: z.string().describe('Short, descriptive title of the finding'),
    description: z.string().describe('Detailed description of what was discovered'),
    severity: z.enum(['info', 'low', 'medium', 'high', 'critical']).describe('Severity level of this finding'),
    category: z.string().describe('General technical category scope'),
    type: z.enum(['strength', 'weakness', 'missing_info', 'neutral']).describe('Deterministic alignment of this finding'),
    status: z.string().describe('State tracking status natively')
});
export type Finding = z.infer<typeof FindingSchema>;

export const EvidenceSchema = z.object({
    id: z.string().describe('Unique identifier for this piece of evidence'),
    claimId: z.string().describe('ID of the claim or finding this evidence supports'),
    source: z.string().describe('The URL or specific document name where this was found'),
    sourceType: z.enum(['whitepaper', 'github', 'website', 'documentation']).describe('Type of source'),
    snippet: z.string().describe('Exact quote or relevant context snippet from the source'),
    confidence: z.enum(['high', 'medium', 'low']).describe('Confidence level in this specific evidence'),
    pageNumber: z.number().optional().describe('Page number if present'),
    sectionHeading: z.string().optional().describe('Section header if applicable'),
    paragraphIndex: z.number().optional().describe('Paragraph index in section'),
    agentName: z.string().optional().describe('Authoring agent identifier context'),
    findingTitle: z.string().optional().describe('Title of the finding this evidence supports'),
    findingSeverity: z.string().optional().describe('Severity inherited natively from the parent finding'),
    findingDescription: z.string().optional().describe('Human readable description mapped from parent finding'),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const SourceReferenceSchema = z.object({
    url: z.string().describe('URL or identifier of the source'),
    title: z.string().describe('Human-readable title of the source'),
    collectedAt: z.string().describe('ISO timestamp of when this source was collected'),
});
export type SourceReference = z.infer<typeof SourceReferenceSchema>;

export const AgentResultSchema = z.object({
    status: z.enum(['success', 'failed']).describe('Whether the agent successfully completed the analysis'),
    error: z.string().nullable().optional().describe('Typed error message if status is failed'),
    summary: z.string().nullable().describe('High-level summary of the agent\'s findings'),
    findings: z.array(FindingSchema).nullable().describe('List of specific findings discovered by the agent'),
    evidence: z.array(EvidenceSchema).nullable().describe('Evidentiary snippets backing up the findings'),
    sources: z.array(SourceReferenceSchema).nullable().describe('References utilized during analysis'),
    confidence: z.number().min(0).max(100).nullable().describe('Overall confidence score (0-100) of this analysis'),
    executionMetadata: z.object({
        agentName: z.string(),
        processedTokens: z.number().optional(),
        durationMs: z.number().optional(),
        qualityScores: z.object({
            overallScore: z.number().min(0).max(100),
            breakdown: z.object({
                clarity: z.number().min(0).max(100).optional(),
                completeness: z.number().min(0).max(100).optional(),
                technicalDepth: z.number().min(0).max(100).optional(),
                consistency: z.number().min(0).max(100).optional(),
                readability: z.number().min(0).max(100).optional(),
                // GitHub Specific metrics
                activity: z.number().min(0).max(100).optional(),
                documentation: z.number().min(0).max(100).optional(),
                maintainability: z.number().min(0).max(100).optional(),
                openness: z.number().min(0).max(100).optional(),
                engineeringPractices: z.number().min(0).max(100).optional(),
                // Documentation Specific metrics
                navigation: z.number().min(0).max(100).optional(),
                developerExperience: z.number().min(0).max(100).optional(),
                apiDocumentation: z.number().min(0).max(100).optional(),
            }).optional()
        }).nullable().optional().describe('Metric scores grading the target subject on qualitative bounds. Used selectively by specific agents.'),
        extractedFacts: z.object({
            foundSections: z.array(z.string()).optional(),
            missingSections: z.array(z.string()).optional(),
            securityPatterns: z.array(z.string()).optional(),
            ecosystemIntegrations: z.array(z.string()).optional(),
            hasTokenomics: z.boolean().optional(),
        }).nullable().optional().describe('Hard deterministic facts explicitly extracted from the source.'),
    }).describe('Metadata about the execution logic'),
});
export type AgentResult = z.infer<typeof AgentResultSchema>;

export const ReportSectionSchema = z.object({
    title: z.string().describe('Section title/header'),
    score: z.number().min(0).max(100).optional().describe('Metric score for this specific dimension, if applicable'),
    content: z.string().describe('Markdown formatted content body of the section'),
});
export type ReportSection = z.infer<typeof ReportSectionSchema>;

export const FinalReportSchema = z.object({
    projectName: z.string().describe('Name of the analyzed project'),
    generatedAt: z.string().describe('ISO timestamp of when the final report was generated'),
    sections: z.array(ReportSectionSchema).describe('Categorized analysis sections of the report'),
    strengths: z.array(z.string()).describe('List of highlighted project strengths'),
    weaknesses: z.array(z.string()).describe('List of project risks or apparent weaknesses'),
    missingInformation: z.array(z.string()).describe('List of important data that was undiscoverable/missing'),
    evidence: z.array(EvidenceSchema).optional().describe('Directly propagated evidence blocks mapped from collectors'),
    disclaimer: z.string().describe('Mandatory financial non-investment advice disclaimer'),
    githubData: z.object({
        stars: z.number(),
        forks: z.number(),
        openIssues: z.number(),
        license: z.string().nullable(),
        contributorsCount: z.number(),
        releases: z.number(),
        lastCommitDate: z.string().nullable(),
        recentCommits: z.array(z.object({
            sha: z.string(),
            message: z.string(),
            date: z.string(),
            author: z.string()
        })).optional()
    }).nullable().optional().describe('Raw data piped securely from the GitHub REST Collector escaping the LLM completely.'),
    categoryScores: z.object({
        security: z.number(),
        repository: z.number(),
        documentation: z.number(),
        transparency: z.number(),
        tokenomics: z.number()
    }).describe('Mathematically derived breakdown of the overall score.'),
    evidenceCoverage: z.number().describe('Percentage of claims backed by evidence'),
    securityPenalties: z.array(z.object({ reason: z.string(), penalty: z.number() })).optional(),
    coveragePenalties: z.array(z.object({ reason: z.string(), penalty: z.number() })).optional(),
    extractedFacts: z.object({
        docSections: z.array(z.string()).optional(),
        missingDocSections: z.array(z.string()).optional(),
        securityPatterns: z.array(z.string()).optional(),
        ecosystemIntegrations: z.array(z.string()).optional(),
        hasTokenomics: z.boolean().optional()
    }).optional().describe('Aggregate extraction metrics used for deterministic UI visualization.')
});
export type FinalReport = z.infer<typeof FinalReportSchema>;
