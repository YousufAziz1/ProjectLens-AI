import { CollectorOutput, CollectorMetadata } from '@/types';

export async function collectFromPdf(buffer: Buffer): Promise<CollectorOutput<string>> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const startTime = Date.now();
    const metadata: CollectorMetadata = {};

    try {
        const data = await pdfParse(buffer);

        metadata.fetchTimeMs = Date.now() - startTime;
        metadata.contentLength = data.text.length;
        metadata.numpages = data.numpages;
        metadata.info = data.info;

        return {
            source: 'whitepaper',
            status: 'success',
            collectedAt: new Date().toISOString(),
            metadata,
            data: data.text,
            error: null,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error parsing PDF';
        return {
            source: 'whitepaper',
            status: 'failed',
            collectedAt: new Date().toISOString(),
            metadata: { fetchTimeMs: Date.now() - startTime },
            data: null,
            error: errorMessage,
        };
    }
}
