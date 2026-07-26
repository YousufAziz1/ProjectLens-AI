import { UnifiedCollectorOutput } from '@/types';

/**
 * Shared AI Execution Context
 * Passed to every future AI agent to ensure they have the same baseline truth.
 */
export interface AiContext {
    executionId: string;
    projectId: string; // E.g., the URL or normalized name of the project
    collectedData: UnifiedCollectorOutput; // Data from our Phase 3 data collection layer

    // As agents run, their outputs are pushed here so subsequent agents can read them.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    previousAgentResults: Record<string, any>;

    startedAt: string; // ISO timestamp when the orchestration began
}

export function createAiContext(
    executionId: string,
    projectId: string,
    collectedData: UnifiedCollectorOutput
): AiContext {
    return {
        executionId,
        projectId,
        collectedData,
        previousAgentResults: {},
        startedAt: new Date().toISOString(),
    };
}
