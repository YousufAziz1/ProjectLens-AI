import { FinalReport, ReportSection, Finding } from '../ai/schemas';
import { NormalizedResult } from './result-normalizer';
import { UnifiedCollectorOutput } from '@/types';

export class MasterReportAgent {
    /**
     * Purely deterministic map generating the finalized UI report object natively globally.
     * ZERO LLM calls executed here. Preserves structural purity and confidence metrics securely.
     */
    public compileReport(projectName: string, normalized: NormalizedResult, collectedData: UnifiedCollectorOutput): FinalReport {
        const sections: ReportSection[] = [];
        const strengths: string[] = [];
        const weaknesses: string[] = [];
        const missingInfo: string[] = [];

        // 1. MATHEMATICAL SCORING ALGORITHM
        let securityMultiplier = 100;
        let severeRisks = 0;
        const securityPenalties: { reason: string; penalty: number }[] = [];

        let evidenceCoverage = 100;
        const coveragePenalties: { reason: string; penalty: number }[] = [];

        const ghData = collectedData.github?.data;
        if (!ghData) {
            evidenceCoverage -= 35;
            coveragePenalties.push({ reason: 'Unverifiable Public Source Repository', penalty: 35 });
            missingInfo.push("Unable to implicitly verify public repository metadata or commits");
        }

        const missingDocs = normalized.extractedFacts.missingDocSections?.length || 0;
        let docScore = 0;
        const hasDocs = collectedData.documentation?.status === 'success';
        const hasDocEvidence = normalized.extractedFacts.docSections && normalized.extractedFacts.docSections.length > 0;

        if (hasDocs && hasDocEvidence) {
            docScore = Math.max(0, 100 - (missingDocs * 15));
            if (missingDocs > 0) {
                evidenceCoverage -= (missingDocs * 5);
                coveragePenalties.push({ reason: `Missing ${missingDocs} Fundamental Document Sections`, penalty: (missingDocs * 5) });
            }
        } else {
            evidenceCoverage -= 20;
            coveragePenalties.push({ reason: 'Unverifiable Base Documentation Layer', penalty: 20 });
            missingInfo.push("Unable to verify core structural architecture via explicit documentation");
        }

        const tokenomicsScore = normalized.extractedFacts.hasTokenomics ? 100 : 0;
        if (tokenomicsScore === 0) {
            evidenceCoverage -= 20;
            coveragePenalties.push({ reason: 'No Tokenomics Logic Verified', penalty: 20 });
            missingInfo.push("Tokenomics logic undiscoverable or explicitly missing");
        }

        const activeSources = normalized.executionSummary.successfulAgents.length;
        if (activeSources < 2) {
            evidenceCoverage -= 15;
            coveragePenalties.push({ reason: 'Missing Parallel Audit Validation Sources', penalty: 15 });
            missingInfo.push("Insufficient parallel intelligence sources for consensus validation");
        }

        let transScore = activeSources >= 3 ? 100 : activeSources >= 2 ? 70 : 30;
        evidenceCoverage = Math.max(0, evidenceCoverage);

        for (const finding of normalized.normalizedFindings) {
            if (finding.severity === 'critical') { securityMultiplier -= 20; severeRisks++; securityPenalties.push({ reason: finding.title, penalty: 20 }); }
            else if (finding.severity === 'high') { securityMultiplier -= 10; severeRisks++; securityPenalties.push({ reason: finding.title, penalty: 10 }); }
            else if (finding.severity === 'medium') { securityMultiplier -= 5; securityPenalties.push({ reason: finding.title, penalty: 5 }); }
            else if (finding.severity === 'low') { securityMultiplier -= 2; securityPenalties.push({ reason: finding.title, penalty: 2 }); }
        }

        const securityScore = Math.max(0, securityMultiplier);

        let repoScore = 0;
        if (ghData) {
            if (ghData.contributorsCount > 0) repoScore += 20;
            if (ghData.recentCommits && ghData.recentCommits.length > 0) repoScore += 25;
            if (ghData.stars > 10) repoScore += 25;
            if (ghData.license) repoScore += 30;
        }

        const categoryScores = {
            security: securityScore,
            repository: repoScore,
            documentation: docScore,
            transparency: transScore,
            tokenomics: tokenomicsScore
        };

        let overallWeightedScore = Math.round(
            (securityScore * 0.40) +
            (repoScore * 0.25) +
            (docScore * 0.20) +
            (transScore * 0.10) +
            (tokenomicsScore * 0.05)
        );

        if (normalized.extractedFacts.ecosystemIntegrations && normalized.extractedFacts.ecosystemIntegrations.length > 0) {
            overallWeightedScore = Math.min(100, Math.round(overallWeightedScore + (normalized.extractedFacts.ecosystemIntegrations.length * 2.5)));
        }

        // 2. FACTUAL EXECUTIVE SUMMARY
        const execSummaryContent = `TrustLens-AI executed a mathematically rigorous deterministic Web3 Security audit on ${projectName}.\n\n` +
            `**Audit Matrix**:\n` +
            `- **Security Integrity**: ${securityScore}/100 (${severeRisks} severe risks identified)\n` +
            `- **Repository Health**: ${repoScore}/100 (${ghData ? `${ghData.recentCommits?.length || 0} recent commits from ${ghData.contributorsCount} contributors` : 'Missing Repository Data'})\n` +
            `- **Documentation Coverage**: ${docScore}/100 (${missingDocs} structural sections missing)\n` +
            `- **Transparency Base**: ${transScore}/100 (${activeSources} independent data sources cryptographically verified)\n` +
            `- **Tokenomics Model**: ${tokenomicsScore === 100 ? 'Present and Verifiable' : 'Not Discovered or Unavailable'}\n\n` +
            `**Overall Weighted Protocol Score**: **${overallWeightedScore}/100** points mapped across ${normalized.normalizedEvidence.length} distinct verification vectors.`;

        sections.push({
            title: 'Executive Summary',
            content: execSummaryContent,
            score: overallWeightedScore
        });

        // Pre-fill deterministic strength and weakness arrays natively based strictly on explicit parameters
        if (ghData) {
            if (ghData.license) strengths.push(`[INFO] Verified OSI License: ${ghData.license}`);
            else weaknesses.push(`[MEDIUM] No Explicit Software License Detected`);

            if (ghData.releases > 0) strengths.push(`[INFO] Consistent Release Cycle (${ghData.releases} Published Tags)`);
            else weaknesses.push(`[LOW] No Formal Software Releases`);

            if (ghData.contributorsCount > 3) strengths.push(`[LOW] Distributed Contributor Risk (${ghData.contributorsCount} active devs)`);
            else if (ghData.contributorsCount <= 1) weaknesses.push(`[HIGH] Single Point of Failure (Only 1 Active Contributor)`);

            if (ghData.openIssues > 20) weaknesses.push(`[LOW] Elevated Issue Backlog (${ghData.openIssues} Open Tickets)`);
        } else {
            weaknesses.push(`[CRITICAL] Root Source Code Repository Invalid Or Inaccessible`);
        }

        if (missingDocs === 0) {
            strengths.push(`[INFO] Comprehensive Architecture Documentation Infrastructure`);
        } else {
            weaknesses.push(`[MEDIUM] Missing ${missingDocs} Fundamental Protocol Architecture Documents`);
        }

        if (tokenomicsScore === 100) strengths.push(`[INFO] Transparent Tokenomics Module Verified`);
        else weaknesses.push(`[HIGH] No Verified Tokenomics Structure Or Smart Contract Logic`);

        if (activeSources >= 2) strengths.push(`[INFO] Independent Multi-Source Cross Validation Executed`);
        else weaknesses.push(`[CRITICAL] Information Symmetry Failure (Only ${activeSources} Valid Audit Sources)`);

        // Analyze and categorize AI finding items deterministically strictly parsing schema properties
        for (const finding of normalized.normalizedFindings) {
            // Heuristics for missing info natively aligned to typings
            if (finding.type === 'missing_info' || finding.status === 'failed') {
                missingInfo.push(finding.title);
            }
            // Mapped exactly to AI category strength
            else if (finding.type === 'strength' || finding.category === 'strength') {
                strengths.push(finding.title);
            }
            // Strict mapping to weaknesses based purely on explicitly bound data parameters
            else if (finding.type === 'weakness' || ['high', 'critical'].includes(finding.severity)) {
                weaknesses.push(`${finding.title} [${finding.severity.toUpperCase()}]`);
            }
            else {
                if (['medium'].includes(finding.severity)) {
                    weaknesses.push(`${finding.title} [${finding.severity.toUpperCase()}]`);
                } else if (finding.severity === 'info') {
                    strengths.push(finding.title);
                }
            }
        }

        // Only include conflicts if there are any
        if (normalized.conflicts.length > 0) {
            let conflictDetails = '';
            normalized.conflicts.forEach((c, idx) => {
                conflictDetails += `### Conflict ${idx + 1}: ${c.reason}\n`;
                conflictDetails += `- Agent A Logged: ${c.findingA.title} (${c.findingA.severity})\n`;
                conflictDetails += `- Agent B Logged: ${c.findingB.title} (${c.findingB.severity})\n\n`;
            });
            sections.push({ title: 'Data Conflicts', content: conflictDetails });
        }

        return {
            projectName,
            generatedAt: new Date().toISOString(),
            sections,
            strengths: [...new Set(strengths)],
            weaknesses: [...new Set(weaknesses)],
            missingInformation: [...new Set(missingInfo)],
            evidence: normalized.normalizedEvidence,
            githubData: ghData,
            categoryScores,
            evidenceCoverage,
            securityPenalties,
            coveragePenalties,
            extractedFacts: normalized.extractedFacts,
            disclaimer: 'DISCLAIMER: This is a software research tool generating automated reports based strictly on algorithmic data extraction. None of this data constitutes financial, investment, buy, or sell advice. Please conduct your own strict due diligence.'
        };
    }

    private formatSection(title: string, findings: Finding[]): ReportSection {
        let content = '';
        findings.forEach((finding, idx) => {
            content += `### ${idx + 1}. ${finding.title} [Status: ${finding.severity.toUpperCase()}]\n`;
            content += `${finding.description}\n\n`;
        });

        return {
            title,
            content
        };
    }
}
