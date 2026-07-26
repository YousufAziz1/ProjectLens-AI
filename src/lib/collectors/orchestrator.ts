import { UnifiedCollectorInput, UnifiedCollectorOutput, CollectorOutput } from '@/types';
import { collectFromPdf } from './pdf';
import { collectFromWebsite } from './website';
import { collectFromDocumentation } from './documentation';
import { collectFromGitHub } from './github';

// In future, this orchestration will be moved to a background job queue (e.g. BullMQ/Inngest)
// leaving the API route responsive
export async function runUnifiedCollection(
    id: string,
    input: UnifiedCollectorInput
): Promise<UnifiedCollectorOutput> {
    const [websiteResult, docsResult, githubResult, whitepaperResult] = await Promise.allSettled([
        input.websiteUrl ? collectFromWebsite(input.websiteUrl) : Promise.resolve(null),
        input.docsUrl ? collectFromDocumentation(input.docsUrl) : Promise.resolve(null),
        input.githubUrl ? collectFromGitHub(input.githubUrl) : Promise.resolve(null),
        input.whitepaperBuffer ? collectFromPdf(input.whitepaperBuffer) : Promise.resolve(null)
    ]);

    const output: UnifiedCollectorOutput = {
        id,
        website: websiteResult.status === 'fulfilled' ? websiteResult.value : constructErrorOutput('website', websiteResult.reason),
        documentation: docsResult.status === 'fulfilled' ? docsResult.value : constructErrorOutput('documentation', docsResult.reason),
        github: githubResult.status === 'fulfilled' ? githubResult.value : constructErrorOutput('github', githubResult.reason),
        whitepaper: whitepaperResult.status === 'fulfilled' ? whitepaperResult.value : constructErrorOutput('whitepaper', whitepaperResult.reason),
    };

    return output;
}

function constructErrorOutput<T>(source: 'website' | 'documentation' | 'github' | 'whitepaper', error: unknown): CollectorOutput<T> {
    return {
        source,
        status: 'failed',
        collectedAt: new Date().toISOString(),
        metadata: {}, // basic fallback metadata
        data: null,
        error: error instanceof Error ? error.message : String(error)
    };
}
