import { AgentResult, Finding, Evidence } from '../ai/schemas';

export interface Conflict {
    findingA: Finding;
    findingB: Finding;
    reason: string;
}

export interface NormalizedResult {
    normalizedFindings: Finding[];
    normalizedEvidence: Evidence[];
    groupedSections: Record<string, Finding[]>;
    conflicts: Conflict[];
    executionSummary: {
        totalAgents: number;
        successfulAgents: string[];
        failedAgents: string[];
        totalDurationMs: number;
        averageConfidence: number;
    };
    extractedFacts: {
        docSections: string[];
        missingDocSections: string[];
        securityPatterns: string[];
        ecosystemIntegrations?: string[];
        hasTokenomics: boolean;
    };
}

export class ResultNormalizer {
    /**
     * Normalizes an array of AgentResult payloads.
     * Pure code implementation avoiding LLM hallucination overrides.
     */
    public normalize(results: AgentResult[]): NormalizedResult {
        const normalizedFindings: Finding[] = [];
        const normalizedEvidence: Evidence[] = [];
        const groupedSections: Record<string, Finding[]> = {};
        const conflicts: Conflict[] = [];

        let totalDurationMs = 0;
        const successfulAgents: string[] = [];
        const failedAgents: string[] = [];
        let confidencePulse = 0;
        let confidentAgentCount = 0;

        const docSections: string[] = [];
        const missingDocSections: string[] = [];
        const securityPatterns: string[] = [];
        const ecosystemIntegrations: string[] = [];
        let hasTokenomics = false;

        for (const result of results) {
            const agentName = result.executionMetadata?.agentName || 'UnknownAgent';

            if (result.executionMetadata?.extractedFacts) {
                const facts = result.executionMetadata.extractedFacts;
                if (facts.foundSections) docSections.push(...facts.foundSections);
                if (facts.missingSections) missingDocSections.push(...facts.missingSections);
                if (facts.securityPatterns) securityPatterns.push(...facts.securityPatterns);
                if (facts.ecosystemIntegrations) ecosystemIntegrations.push(...facts.ecosystemIntegrations);
                if (facts.hasTokenomics) hasTokenomics = true;
            }

            // Handle execution context
            if (result.status === 'failed') {
                failedAgents.push(agentName);
                if (result.executionMetadata?.durationMs) {
                    totalDurationMs += result.executionMetadata.durationMs;
                }
                continue;
            }

            successfulAgents.push(agentName);
            groupedSections[agentName] = [];

            if (result.executionMetadata?.durationMs) {
                totalDurationMs += result.executionMetadata.durationMs;
            }
            if (result.confidence !== null && result.confidence !== undefined) {
                confidencePulse += result.confidence;
                confidentAgentCount++;
            }

            // Evidence deduplication (naive structural match via snippet bounds or ID)
            for (const ev of (result.evidence || [])) {
                // Attach agent name context natively here
                ev.agentName = agentName;
                const parentFinding = result.findings?.find(f => f.id === ev.claimId);
                ev.findingTitle = parentFinding?.title || 'Context Trace';
                ev.findingSeverity = parentFinding?.severity || 'info';
                ev.findingDescription = parentFinding?.description || 'Raw evidentiary parameters successfully extracted.';

                const isDuplicate = normalizedEvidence.some(e => e.snippet === ev.snippet && e.sourceType === ev.sourceType);
                if (!isDuplicate) {
                    normalizedEvidence.push(ev);
                }
            }

            // Finding deduplication and conflict tracking
            for (const finding of (result.findings || [])) {
                const existingFinding = normalizedFindings.find(f => f.title.toLowerCase() === finding.title.toLowerCase());

                if (existingFinding) {
                    // Conflict detection: Exact same title but wildly different severities? 
                    if (existingFinding.severity !== finding.severity) {
                        conflicts.push({
                            findingA: existingFinding,
                            findingB: finding,
                            reason: `Conflicting severity for identically titled finding: ${existingFinding.severity} vs ${finding.severity}`
                        });
                        // User instruction says: "Keep both findings and mark them as conflicting."
                        normalizedFindings.push(finding);
                        groupedSections[agentName].push(finding);
                    }
                    // Else, it's a pure duplicate (same title, same severity), we silently drop the duplicate instance
                    // to adhere strictly to "removes duplicate findings"
                } else {
                    normalizedFindings.push(finding);
                    groupedSections[agentName].push(finding);
                }
            }
        }

        return {
            normalizedFindings,
            normalizedEvidence,
            groupedSections,
            conflicts,
            executionSummary: {
                totalAgents: results.length,
                successfulAgents,
                failedAgents,
                totalDurationMs,
                averageConfidence: confidentAgentCount > 0 ? Math.round(confidencePulse / confidentAgentCount) : 0,
            },
            extractedFacts: {
                docSections: [...new Set(docSections)],
                missingDocSections: [...new Set(missingDocSections)],
                securityPatterns: [...new Set(securityPatterns)],
                ecosystemIntegrations: [...new Set(ecosystemIntegrations)],
                hasTokenomics
            }
        };
    }
}
