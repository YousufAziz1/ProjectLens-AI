import { DocumentationAgent } from './src/lib/agents/documentation-agent';
import { AiContext } from './src/lib/ai/context';

async function test() {
    const agent = new DocumentationAgent();
    const context = {
        executionId: 'test-123',
        projectId: 'test-123',
        startedAt: new Date().toISOString(),
        previousAgentResults: {},
        collectedData: {
            documentation: {
                status: 'success',
                data: 'To install TrustLens, run npm install and npm build. This project is highly experimental. Contains APIs for web scraping.'
            }
        }
    } as unknown as AiContext;

    try {
        const res = await agent.execute(undefined, context, 1);
        console.dir(res, { depth: null });
    } catch (e) {
        console.error("CRASHED:", e);
        const err = e as Error & { cause?: unknown };
        if (err.cause) console.error("CAUSE:", err.cause);
    }
}

test();
