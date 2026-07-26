import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { AgentResultSchema } from './src/lib/ai/schemas';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        const model = google('gemini-2.0-flash-lite');
        const res = await generateObject({
            model,
            schema: AgentResultSchema,
            prompt: 'Output a test AgentResult mapping with zero findings.'
        });
        console.log(res.object);
    } catch (e: any) {
        console.log("FULL ERROR TRACE: ", e.message);
        if (e.cause) console.log("CAUSE: ", e.cause);
    }
}
test();
