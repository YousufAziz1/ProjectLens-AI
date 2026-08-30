# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json


class TrustLensVerifier(gl.Contract):
    """
    GenLayer Intelligent Contract for Web3 project due diligence verification.

    This contract accepts structured evidence collected by the TrustLens pipeline
    (GitHub metrics, security findings, documentation quality, deterministic scores)
    and independently evaluates it using GenLayer's AI-validated consensus to produce
    a trustless verification result.

    Unlike centralized AI inference, this contract's evaluation is validated by
    multiple independent AI validators through Optimistic Democracy, ensuring that
    no single party can manipulate the trust assessment.
    """

    verifications: TreeMap[str, str]
    verification_count: u32

    def __init__(self):
        self.verifications = TreeMap()
        self.verification_count = 0

    @gl.public.write
    def verify_project(self, evidence_json: str) -> None:
        """
        Accept structured project evidence, perform independent AI-validated
        evaluation, and store the consensus-verified result on-chain.
        """
        # Parse the incoming evidence
        evidence = json.loads(evidence_json)

        target_url = evidence.get("target_url", "unknown")
        github_url = evidence.get("github_url", "")
        repo_metrics = evidence.get("repository_metrics", {})
        security_findings = evidence.get("security_findings", [])
        doc_findings = evidence.get("documentation_findings", {})
        det_scores = evidence.get("deterministic_scores", {})
        evidence_count = evidence.get("evidence_count", 0)

        # Build the evaluation prompt from real evidence
        evaluation_prompt = self._build_evaluation_prompt(
            target_url, github_url, repo_metrics,
            security_findings, doc_findings, det_scores, evidence_count
        )

        # Use GenLayer's non-deterministic consensus to independently evaluate
        with gl.eq_principle(
            comparative=True,
            principle="The result must be a valid JSON object. Two evaluations are "
                      "equivalent if they assign the same risk_level, the same decision, "
                      "and trust_scores within 10 points of each other."
        ):
            evaluation = gl.exec_prompt(evaluation_prompt)

        # Parse the LLM evaluation result
        result = self._parse_evaluation(evaluation, det_scores, evidence_count)

        # Store the verification result
        self.verification_count += 1
        verification_id = f"v_{self.verification_count}"
        self.verifications[verification_id] = json.dumps(result)
        self.verifications["latest"] = json.dumps(result)

    @gl.public.view
    def get_latest_verification(self) -> str:
        """Return the most recent verification result as JSON."""
        return self.verifications.get("latest", "{}")

    @gl.public.view
    def get_verification(self, verification_id: str) -> str:
        """Return a specific verification result by ID."""
        return self.verifications.get(verification_id, "{}")

    @gl.public.view
    def get_verification_count(self) -> u32:
        """Return the total number of verifications performed."""
        return self.verification_count

    def _build_evaluation_prompt(
        self, target_url, github_url, repo_metrics,
        security_findings, doc_findings, det_scores, evidence_count
    ):
        """Build a structured evaluation prompt from collected evidence."""

        prompt_parts = [
            "You are an independent Web3 project security evaluator.",
            "Analyze the following collected evidence and produce a trust assessment.",
            "",
            f"## Target Project: {target_url}",
        ]

        if github_url:
            prompt_parts.append(f"GitHub: {github_url}")

        if repo_metrics:
            prompt_parts.extend([
                "",
                "## Repository Metrics",
                f"- Stars: {repo_metrics.get('stars', 'N/A')}",
                f"- Forks: {repo_metrics.get('forks', 'N/A')}",
                f"- Open Issues: {repo_metrics.get('open_issues', 'N/A')}",
                f"- Recent Commits: {repo_metrics.get('recent_commits', 'N/A')}",
                f"- Contributors: {repo_metrics.get('contributors', 'N/A')}",
                f"- License: {'Yes' if repo_metrics.get('has_license') else 'No'}",
                f"- Language: {repo_metrics.get('primary_language', 'N/A')}",
            ])

        if security_findings:
            prompt_parts.extend(["", "## Security Findings"])
            for i, finding in enumerate(security_findings[:10], 1):
                prompt_parts.append(
                    f"{i}. [{finding.get('severity', 'info')}] "
                    f"{finding.get('title', 'Unknown')}: "
                    f"{finding.get('description', '')[:200]}"
                )

        if doc_findings:
            prompt_parts.extend([
                "",
                "## Documentation Assessment",
                f"- Quality: {doc_findings.get('quality', 'unknown')}",
                f"- Sections Found: {', '.join(doc_findings.get('sections_found', []))}",
                f"- Sections Missing: {', '.join(doc_findings.get('sections_missing', []))}",
            ])

        if det_scores:
            prompt_parts.extend([
                "",
                "## Deterministic Scores (from pipeline)",
                f"- Security: {det_scores.get('security_score', 0)}/100",
                f"- Repository: {det_scores.get('repository_score', 0)}/100",
                f"- Documentation: {det_scores.get('documentation_score', 0)}/100",
                f"- Transparency: {det_scores.get('transparency_score', 0)}/100",
                f"- Overall: {det_scores.get('overall_score', 0)}/100",
            ])

        prompt_parts.append(f"\nTotal evidence items collected: {evidence_count}")

        prompt_parts.extend([
            "",
            "## Your Task",
            "Based on ALL the evidence above, produce a JSON object with exactly these fields:",
            '- "trust_score": integer 0-100 (your independent assessment)',
            '- "risk_level": one of "critical", "high", "medium", "low", "minimal"',
            '- "decision": one of "reject", "caution", "acceptable", "recommended"',
            '- "key_findings": array of 3-5 short string observations',
            '- "evidence_quality": one of "insufficient", "partial", "adequate", "comprehensive"',
            '- "rationale": a 2-3 sentence summary of your reasoning',
            "",
            "IMPORTANT: Base your evaluation on the actual evidence provided.",
            "Do NOT inflate or deflate scores without justification from the evidence.",
            "If evidence is missing or incomplete, reflect that in evidence_quality and trust_score.",
            "",
            "Respond with ONLY the JSON object, no markdown, no explanation.",
        ])

        return "\n".join(prompt_parts)

    def _parse_evaluation(self, evaluation, det_scores, evidence_count):
        """Parse the LLM evaluation and merge with deterministic data."""
        try:
            if isinstance(evaluation, dict):
                result = evaluation
            else:
                # Strip any markdown formatting
                clean = evaluation.strip()
                if clean.startswith("```"):
                    clean = clean.split("\n", 1)[-1]
                    clean = clean.rsplit("```", 1)[0]
                result = json.loads(clean)
        except (json.JSONDecodeError, Exception):
            # Fallback to deterministic scores if LLM parsing fails
            overall = det_scores.get("overall_score", 50)
            result = {
                "trust_score": overall,
                "risk_level": "high" if overall < 40 else "medium" if overall < 65 else "low",
                "decision": "reject" if overall < 30 else "caution" if overall < 55 else "acceptable",
                "key_findings": ["Evaluation parsing failed; using deterministic fallback"],
                "evidence_quality": "partial" if evidence_count > 3 else "insufficient",
                "rationale": "GenLayer AI evaluation could not be parsed. "
                             "Falling back to deterministic pipeline scores.",
            }

        return result
