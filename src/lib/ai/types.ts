import { z } from 'zod';

// Typed Errors
export class AiValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AiValidationError';
    }
}

export class AiTimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AiTimeoutError';
    }
}

export class AiProviderError extends Error {
    constructor(message: string, public readonly statusCode?: number) {
        super(message);
        this.name = 'AiProviderError';
    }
}

export class AiGenerationError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
        super(message);
        this.name = 'AiGenerationError';
    }
}

// Execution Logging
export interface AiExecutionLog {
    executionId: string;
    agentName: string;
    startedAt: string; // ISO String
    finishedAt: string; // ISO String
    durationMs: number;
    inputTokens: number;
    outputTokens: number;
    success: boolean;
    failureReason?: string;
}

// Provider Interface (Abstractions for future support of OpenAI, Claude, etc.)
export interface AiProvider {
    generateObject<T>(prompt: string, schema: z.ZodSchema<T>): Promise<{
        object: T;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        usage: any;
    }>;

    streamObject<T>(prompt: string, schema: z.ZodSchema<T>): Promise<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        partialObjectStream: AsyncIterable<any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        usage: Promise<any>;
    }>;
}
