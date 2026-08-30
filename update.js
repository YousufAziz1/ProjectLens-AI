const cp = require('child_process');
const fs = require('fs');
try {
    const servicePayload = JSON.stringify([{
        "operation": "create",
        "serviceName": "Web3 Due Diligence Auditor",
        "serviceDescription": "1. AI-powered Web3 due diligence agent for developers, investors, and ecosystem participants. TrustLens-AI analyzes Web3 projects using autonomous agents to evaluate technical infrastructure, documentation, and public evidence.\n2. A Web3 project website URL, documentation URL, GitHub repository link, or whitepaper PDF. The agent uses these inputs to collect and analyze available project information.\n3. An evidence-backed Web3 audit report with risk assessment, technical analysis, documentation insights, security evaluation, and transparent scoring based on verified information.",
        "serviceType": "A2MCP",
        "fee": "1",
        "endpoint": "https://project-lens-ai.vercel.app/"
    }]);

    const out = cp.execFileSync('C:\\Users\\USER\\.local\\bin\\onchainos.exe', [
        'agent', 'update',
        '--agent-id', '9422',
        '--service', servicePayload
    ]).toString();

    fs.writeFileSync('updateOut.json', out, 'utf8');
} catch (e) {
    if (e.stdout) {
        fs.writeFileSync('updateOut.json', e.stdout.toString(), 'utf8');
    } else {
        console.error(e);
    }
}
