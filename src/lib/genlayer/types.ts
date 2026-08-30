/**
 * GenLayer TypeScript types for TrustLens verification pipeline.
 */

/** Status of a GenLayer verification request lifecycle */
export enum GenLayerVerificationStatus {
    IDLE = 'idle',
    SUBMITTING = 'submitting',
    PENDING = 'pending',
    EXECUTING = 'executing',
    VERIFIED = 'verified',
    FAILED = 'failed',
    UNAVAILABLE = 'unavailable',
}

/** Structured evidence input sent to the GenLayer Intelligent Contract */
export interface ProjectEvidence {
    target_url: string;
    github_url: string | null;
    documentation_url: string | null;
    repository_metrics: {
        stars: number;
        forks: number;
        open_issues: number;
        recent_commits: number;
        contributors: number;
        has_license: boolean;
        primary_language: string | null;
    } | null;
    security_findings: {
        severity: string;
        title: string;
        description: string;
    }[];
    documentation_findings: {
        quality: string;
        sections_found: string[];
        sections_missing: string[];
    } | null;
    deterministic_scores: {
        security_score: number;
        repository_score: number;
        documentation_score: number;
        transparency_score: number;
        overall_score: number;
    };
    evidence_count: number;
    analysis_timestamp: string;
}

/** Structured verification result returned from the GenLayer contract */
export interface VerificationResult {
    trust_score: number;
    risk_level: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
    decision: 'reject' | 'caution' | 'acceptable' | 'recommended';
    key_findings: string[];
    evidence_quality: 'insufficient' | 'partial' | 'adequate' | 'comprehensive';
    rationale: string;
    verification_timestamp: string;
}

/** Full GenLayer verification response including transaction metadata */
export interface GenLayerVerificationResponse {
    status: GenLayerVerificationStatus;
    result: VerificationResult | null;
    transactionHash: string | null;
    contractAddress: string | null;
    executionTimestamp: string | null;
    error: string | null;
    network: string;
}
