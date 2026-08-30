import { z } from 'zod';
import { AiContext } from '../ai/context';
import { aiProvider } from '../ai/provider';
import { AiExecutionLog, AiTimeoutError } from '../ai/types';

export abstract class BaseAgent<Input = unknown, OutputSchema extends z.ZodTypeAny = z.ZodTypeAny> {
    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly outputSchema: OutputSchema;

    /**
     * Subclasses implement this method. It is wrapped by the public `execute()` handler 
     * which provides backoff and logging.
     */
    protected abstract _execute(input: Input, context: AiContext): Promise<z.infer<OutputSchema>>;


    /**
     * Helper function subclasses can use internally to call the AI provider safely.
     */
    protected async generateStructured(prompt: string) {
        return aiProvider.generateObject(prompt, this.outputSchema);
    }

    /**
     * Wait utility used in backoff handling.
     */
    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Public execution wrapper handling retries (exponential backoff) and logging/observability.
     */
    public async execute(
        input: Input,
        context: AiContext,
        retries = 3
    ): Promise<{ data: z.infer<OutputSchema> | null; log: AiExecutionLog }> {
        const startedAt = new Date().toISOString();
        const startTimeMs = Date.now();

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const data = await this._execute(input, context);

                const log: AiExecutionLog = {
                    executionId: context.executionId,
                    agentName: this.name,
                    startedAt,
                    finishedAt: new Date().toISOString(),
                    durationMs: Date.now() - startTimeMs,
                    // Since usage comes from Provider calls which might be multiple inside `_execute`,
                    // we could track them natively in a Context Usage Tracker. For now, we mock success logs.
                    inputTokens: 0,
                    outputTokens: 0,
                    success: true,
                };

                return { data, log };

            } catch (error) {
                const isTimeout = error instanceof AiTimeoutError;
                if (attempt === retries || !isTimeout) {
                    const errStr = error instanceof Error ? error.message : String(error);
                    const lowerStr = errStr.toLowerCase();
                    let failureReason: string | import('@/types').AppError = errStr;

                    if (lowerStr.includes('resource exhausted') || lowerStr.includes('resource_exhausted') || lowerStr.includes('rate limit') || lowerStr.includes('rate_limit') || lowerStr.includes('429') || lowerStr.includes('quota exceeded') || lowerStr.includes('too many requests')) {
                        failureReason = {
                            code: 'API_RATE_LIMIT',
                            message: 'Gemini API limit reached. Please try again later.',
                            provider: 'Gemini'
                        };
                    }

                    // If we exhausted retries or the error isn't retry-able (e.g., Validation error)
                    const log: AiExecutionLog = {
                        executionId: context.executionId,
                        agentName: this.name,
                        startedAt,
                        finishedAt: new Date().toISOString(),
                        durationMs: Date.now() - startTimeMs,
                        inputTokens: 0,
                        outputTokens: 0,
                        success: false,
                        failureReason
                    };

                    return { data: null, log };
                }

                // Exponential backoff
                // 1st retry: 1s, 2nd: 2s, 3rd: 4s
                const backoffMs = Math.pow(2, attempt - 1) * 1000;
                await this.delay(backoffMs);
            }
        }

        // Should theoretically not reach here due to the `attempt === retries` check.
        throw new Error('Unexpected exit from retry loop');
    }
}
