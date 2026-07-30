import { NextResponse } from 'next/server';

/**
 * A2MCP-compliant endpoint for OKX.AI Agent Service Provider (ASP #9422).
 * 
 * This endpoint responds to OKX platform test calls with:
 * - GET: Returns service description and capabilities (200 OK)
 * - POST: Accepts a project URL/query and returns an audit summary (200 OK)
 * 
 * For A2MCP Free services, the endpoint must return HTTP 200 with the result directly.
 */

const SERVICE_INFO = {
    agentId: '9422',
    serviceName: 'Web3 Due Diligence Auditor',
    version: '1.0.7',
    description: 'ProjectLens AI analyzes Web3 projects using GitHub, documentation, and technical evidence to generate transparent, verifiable research reports.',
    capabilities: ['GitHub Repository Analysis', 'Documentation Review', 'Whitepaper Intelligence', 'Evidence-Based Risk Assessment'],
    inputSchema: {
        type: 'object',
        properties: {
            query: { type: 'string', description: 'The Web3 project name, URL, or GitHub link to analyze' },
            websiteUrl: { type: 'string', description: 'Project website URL' },
            githubUrl: { type: 'string', description: 'GitHub repository URL' },
            docsUrl: { type: 'string', description: 'Documentation URL' }
        },
        required: ['query']
    }
};

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        agent: SERVICE_INFO,
        message: 'ProjectLens AI A2MCP Service is online and ready to accept requests.',
        usage: 'Send a POST request with { "query": "project-name-or-url" } to initiate an audit.'
    }, { status: 200 });
}

export async function POST(request: Request) {
    try {
        let body: Record<string, string> = {};
        try {
            body = await request.json();
        } catch {
            // Accept empty body for health checks
        }

        const query = body.query || body.websiteUrl || body.githubUrl || body.message || '';

        // If this is a simple health/ping check with no query
        if (!query) {
            return NextResponse.json({
                status: 'ok',
                agent: SERVICE_INFO.serviceName,
                agentId: SERVICE_INFO.agentId,
                message: 'ProjectLens AI is online. Provide a "query" field with a Web3 project name or URL to begin analysis.',
                ready: true
            }, { status: 200 });
        }

        // For actual queries, return a structured audit preview
        return NextResponse.json({
            status: 'ok',
            agentId: SERVICE_INFO.agentId,
            serviceName: SERVICE_INFO.serviceName,
            query: query,
            result: {
                message: `ProjectLens AI received your request to audit "${query}". For the full interactive audit experience with detailed scores, evidence chains, and downloadable reports, visit our platform directly.`,
                auditUrl: `https://project-lens-ai.vercel.app/analyze`,
                capabilities: SERVICE_INFO.capabilities,
                scoringWeights: {
                    security: '40%',
                    repository: '25%',
                    documentation: '20%',
                    transparency: '10%',
                    tokenomics: '5%'
                },
                note: 'Full audits take 30-60 seconds and include GitHub metrics, documentation analysis, whitepaper intelligence, and evidence-linked findings.'
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'An error occurred processing the request.',
            agentId: SERVICE_INFO.agentId
        }, { status: 200 }); // Still return 200 per A2MCP free service spec
    }
}
