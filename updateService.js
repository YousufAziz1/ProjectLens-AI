const { execFileSync } = require('child_process');
const path = require('path');

const onchainosPath = path.join(process.env.USERPROFILE, '.local', 'bin', 'onchainos.exe');

const servicePayload = JSON.stringify([
    {
        operation: "delete",
        id: "37108",
        serviceName: "Web3 Project Audit Agent",
        serviceDescription: "Old A2A service",
        serviceType: "A2A",
        fee: "0",
        subscription: []
    },
    {
        operation: "create",
        serviceName: "Web3 Due Diligence Auditor",
        serviceDescription: "1. Analyzes Web3 projects via AI to evaluate GitHub, docs, and whitepapers. Generates transparent due diligence reports with technical evidence.\n2. Submit a Web3 project URL, GitHub link, or query. Runs specialized AI analysis to emit an evidence-backed audit report with severity scores.\n3. Returns a structured JSON audit result with scoring weights, capabilities, and direct link to the full interactive report.",
        serviceType: "A2MCP",
        fee: "0",
        endpoint: "https://project-lens-ai.vercel.app/api/a2mcp"
    }
]);

console.log('Running update via execFileSync...');
try {
    const result = execFileSync(onchainosPath, [
        'agent', 'update',
        '--agent-id', '9422',
        '--service', servicePayload
    ], { encoding: 'utf-8', timeout: 60000 });
    console.log('Result:', result);
} catch (err) {
    console.error('Error:', err.stdout || err.stderr || err.message);
}
