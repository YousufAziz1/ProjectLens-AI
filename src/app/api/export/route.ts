import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { FinalReport } from '@/lib/ai/schemas';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const format = searchParams.get('format') || 'json';

    if (!id) {
        return NextResponse.json({ error: 'Missing report id' }, { status: 400 });
    }

    const data = await storage.getCollection(id) as FinalReport | null;
    if (!data) {
        return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (format === 'json') {
        const jsonString = JSON.stringify(data, null, 2);
        return new NextResponse(jsonString, {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="report-${id}.json"`,
            },
        });
    }

    if (format === 'md') {
        let md = `# ProjectLens AI Report: ${data.projectName}\n\n`;
        md += `Generated At: ${data.generatedAt}\n\n`;

        data.sections?.forEach((section: { title: string, score?: number, content: string }) => {
            md += `## ${section.title}\n`;
            if (section.score !== undefined && section.score !== null) {
                md += `**Score**: ${section.score}/100\n\n`;
            }
            md += `${section.content}\n\n`;
        });

        if (data.strengths?.length > 0) {
            md += `## Strengths\n`;
            data.strengths.forEach((s: string) => md += `- ${s}\n`);
            md += `\n`;
        }

        if (data.weaknesses?.length > 0) {
            md += `## Weaknesses\n`;
            data.weaknesses.forEach((s: string) => md += `- ${s}\n`);
            md += `\n`;
        }

        if (data.missingInformation?.length > 0) {
            md += `## Missing Information\n`;
            data.missingInformation.forEach((s: string) => md += `- ${s}\n`);
            md += `\n`;
        }

        md += `\n---\n${data.disclaimer}\n`;

        return new NextResponse(md, {
            headers: {
                'Content-Type': 'text/markdown',
                'Content-Disposition': `attachment; filename="report-${id}.md"`,
            },
        });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
}
