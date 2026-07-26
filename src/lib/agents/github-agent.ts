import { z } from 'zod';
import { BaseAgent } from './base-agent';
import { AiContext } from '../ai/context';
import { AgentResultSchema } from '../ai/schemas';
import { compilePrompt, GITHUB_AGENT_PROMPT } from '../ai/prompts';

export class GitHubAgent extends BaseAgent<void, typeof AgentResultSchema> {
    name = 'GitHubAgent';
    description = 'Analyzes GitHub repository metadata to assess engineering health, activity, and open-source quality signals.';
    outputSchema = AgentResultSchema;

    protected async _execute(_input: void, context: AiContext): Promise<z.infer<typeof AgentResultSchema>> {
        const githubData = context.collectedData.github;

        if (!githubData || githubData.status === 'failed' || !githubData.data) {
            return {
                status: 'failed',
                error: 'GitHub repository metadata is unavailable or failed to resolve.',
                summary: null,
                findings: null,
                evidence: null,
                sources: null,
                confidence: null,
                executionMetadata: {
                    agentName: this.name,
                    qualityScores: null,
                },
            };
        }

        const compiledPrompt = compilePrompt(GITHUB_AGENT_PROMPT, {
            githubData: JSON.stringify(githubData.data, null, 2),
        });

        const result = await this.generateStructured(compiledPrompt);
        return result.object as z.infer<typeof AgentResultSchema>;
    }
}
