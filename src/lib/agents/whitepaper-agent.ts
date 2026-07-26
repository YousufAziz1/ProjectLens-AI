import { z } from 'zod';
import { BaseAgent } from './base-agent';
import { AiContext } from '../ai/context';
import { AgentResultSchema } from '../ai/schemas';
import { compilePrompt, WHITEPAPER_AGENT_PROMPT } from '../ai/prompts';

export class WhitepaperAgent extends BaseAgent<void, typeof AgentResultSchema> {
    name = 'WhitepaperAgent';
    description = 'Analyzes whitepapers for technical clarity, grammar, missing sections, inconsistencies, and unrealistic claims.';
    outputSchema = AgentResultSchema;

    protected async _execute(_input: void, context: AiContext): Promise<z.infer<typeof AgentResultSchema>> {
        const whitepaperData = context.collectedData.whitepaper;

        if (!whitepaperData || whitepaperData.status === 'failed' || !whitepaperData.data) {
            return {
                status: 'failed',
                error: 'Whitepaper data is unavailable or could not be parsed.',
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

        const compiledPrompt = compilePrompt(WHITEPAPER_AGENT_PROMPT, {
            whitepaperText: whitepaperData.data,
        });

        const result = await this.generateStructured(compiledPrompt);
        return result.object as z.infer<typeof AgentResultSchema>;
    }
}
