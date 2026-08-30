import * as cheerio from 'cheerio';
import { CollectorOutput, CollectorMetadata } from '@/types';

export async function collectFromWebsite(url: string): Promise<CollectorOutput<string>> {
    const startTime = Date.now();
    const metadata: CollectorMetadata = { url };

    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) });

        if (!response.ok) {
            if (response.status === 429) {
                return {
                    source: 'website',
                    status: 'failed',
                    collectedAt: new Date().toISOString(),
                    metadata: { url, fetchTimeMs: Date.now() - startTime },
                    data: null,
                    error: {
                        code: 'API_RATE_LIMIT',
                        message: 'API limit reached. Please try again later.',
                        provider: 'Website'
                    }
                };
            }
            throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove unnecessary elements
        $('script, style, nav, footer, header, noscript, iframe, svg, img').remove();

        // Extract text and clean up whitespace
        const text = $('body').text().replace(/\s+/g, ' ').trim();

        metadata.fetchTimeMs = Date.now() - startTime;
        metadata.contentLength = text.length;

        return {
            source: 'website',
            status: 'success',
            collectedAt: new Date().toISOString(),
            metadata,
            data: text,
            error: null,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching website';
        return {
            source: 'website',
            status: 'failed',
            collectedAt: new Date().toISOString(),
            metadata: { url, fetchTimeMs: Date.now() - startTime },
            data: null,
            error: errorMessage,
        };
    }
}
