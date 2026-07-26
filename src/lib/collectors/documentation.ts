import * as cheerio from 'cheerio';
import { CollectorOutput, CollectorMetadata } from '@/types';

export async function collectFromDocumentation(url: string): Promise<CollectorOutput<string>> {
    const startTime = Date.now();
    const metadata: CollectorMetadata = { url };

    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) });

        if (!response.ok) {
            throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove non-content elements
        $('script, style, nav, footer, header, noscript, iframe').remove();

        // Preserve headings with markdown-style prefixes for better AI context later
        $('h1').prepend('# ');
        $('h2').prepend('## ');
        $('h3').prepend('### ');
        $('h4').prepend('#### ');
        $('h5').prepend('##### ');
        $('h6').prepend('###### ');
        $('p, li').append('\n');

        // Extract text from the main article content if available, else body
        const contentArea = $('main, article, .content, .main').length > 0
            ? $('main, article, .content, .main')
            : $('body');

        const fetchInternalContent = async (base: string) => {
            try {
                const links: string[] = [];
                $('nav, aside, .sidebar, header, .menu').find('a[href]').each((_, el) => {
                    const href = $(el).attr('href');
                    if (href && (href.startsWith('/') || href.startsWith(new URL(base).origin))) {
                        try {
                            const absoluteUrl = new URL(href, base).href;
                            if (absoluteUrl !== base && !links.includes(absoluteUrl) && !absoluteUrl.includes('#')) {
                                links.push(absoluteUrl);
                            }
                        } catch (e) { }
                    }
                });

                // Prioritize high-signal pages like architecture, api, security
                const priorityKeywords = ['api', 'architecture', 'security', 'auth', 'getting-started', 'overview'];
                links.sort((a, b) => {
                    const aPrio = priorityKeywords.some(k => a.toLowerCase().includes(k)) ? 1 : 0;
                    const bPrio = priorityKeywords.some(k => b.toLowerCase().includes(k)) ? 1 : 0;
                    return bPrio - aPrio;
                });

                const topLinks = links.slice(0, 4);
                let appendedText = "";

                if (topLinks.length > 0) {
                    const pages = await Promise.all(topLinks.map(async (link) => {
                        try {
                            const res = await fetch(link, { signal: AbortSignal.timeout(8000) });
                            if (res.ok) {
                                const subHtml = await res.text();
                                const sub$ = cheerio.load(subHtml);
                                sub$('script, style, nav, footer, header, noscript, iframe').remove();
                                return `\n\n--- PAGE: ${link} ---\n\n` + (sub$('main, article, .content').length > 0 ? sub$('main, article, .content').text() : sub$('body').text());
                            }
                        } catch (e) { }
                        return "";
                    }));
                    appendedText = pages.join('\n');
                }
                return appendedText;
            } catch (e) {
                return "";
            }
        };

        const internalText = await fetchInternalContent(url);

        // Extract and clean text
        const text = (contentArea.text() + internalText)
            .replace(/\n\s*\n/g, '\n\n') // Normalize multiple newlines
            .trim();

        metadata.fetchTimeMs = Date.now() - startTime;
        metadata.contentLength = text.length;

        return {
            source: 'documentation',
            status: 'success',
            collectedAt: new Date().toISOString(),
            metadata,
            data: text,
            error: null,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching documentation';
        return {
            source: 'documentation',
            status: 'failed',
            collectedAt: new Date().toISOString(),
            metadata: { url, fetchTimeMs: Date.now() - startTime },
            data: null,
            error: errorMessage,
        };
    }
}
