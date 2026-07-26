import { google } from '@ai-sdk/google';
import { generateObject, streamObject } from 'ai';
import { z } from 'zod';
import { AiProvider, AiGenerationError } from './types';

class GeminiProvider implements AiProvider {
    // Passed natively based on custom user runtime model specifier
    private model = google('gemini-3.6-flash');

    async generateObject<T>(prompt: string, schema: z.ZodSchema<T>) {
        try {
            const result = await generateObject({
                model: this.model,
                schema,
                prompt,
            });

            return {
                object: result.object,
                usage: result.usage,
            };
        } catch (error) {
            throw new AiGenerationError('Failed to generate structured object', error);
        }
    }

    async streamObject<T>(prompt: string, schema: z.ZodSchema<T>) {
        try {
            const result = streamObject({
                model: this.model,
                schema,
                prompt,
            });

            return {
                partialObjectStream: result.partialObjectStream,
                usage: result.usage,
            };
        } catch (error) {
            throw new AiGenerationError('Failed to initiate object stream', error);
        }
    }
}

// Ensure the provider is a singleton accessible universally
export const aiProvider: AiProvider = new GeminiProvider();
