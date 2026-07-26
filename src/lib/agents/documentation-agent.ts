import { z } from 'zod';
import { BaseAgent } from './base-agent';
import { AiContext } from '../ai/context';
import { AgentResultSchema } from '../ai/schemas';
import { compilePrompt, DOCUMENTATION_AGENT_PROMPT } from '../ai/prompts';

export class DocumentationAgent extends BaseAgent<void, typeof AgentResultSchema> {
    name = 'DocumentationAgent';
    description = 'Analyzes project documentation for developer completeness, API reference quality, and quick-start clarity.';
    outputSchema = AgentResultSchema;

    protected async _execute(_input: void, context: AiContext): Promise<z.infer<typeof AgentResultSchema>> {
        const docData = context.collectedData.documentation;

        if (!docData || docData.status === 'failed' || !docData.data) {
            return {
                status: 'failed',
                error: 'Documentation metadata is unavailable or failed to resolve.',
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

        const compiledPrompt = compilePrompt(DOCUMENTATION_AGENT_PROMPT, {
            documentationData: docData.data,
        });

        const result = await this.generateStructured(compiledPrompt);
        return result.object as z.infer<typeof AgentResultSchema>;
    }
}
