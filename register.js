const { spawnSync } = require('child_process');

const serviceObj = [{
    "name": "Web3 Project Audit Agent",
    "type": "A2A",
    "fee": "0",
    "subscription": [],
    "description": "1. Analyzes Web3 projects using AI agents to evaluate GitHub repositories, documentation, websites, and whitepapers. Generates transparent due diligence reports with evidence-backed findings, technical quality analysis, and project health insights.\n2. Submit a Web3 project website URL, documentation URL, GitHub repository link, or whitepaper PDF. TrustLens-AI collects available project data, runs specialized AI analysis agents, and returns an evidence-backed audit report with findings, scores, and source references.\n3. Delivered autonomously as an evidence-backed audit report artifact over the A2A sequence."
}];

const args = [
    'agent', 'create',
    '--role', 'asp',
    '--name', 'TrustLens-AI',
    '--description', 'TrustLens-AI is an autonomous AI auditing agent that analyzes Web3 projects using GitHub, documentation, and technical evidence to generate transparent, verifiable research reports.',
    '--picture', 'https://static.okx.com/cdn/web3/wallet/marketplace/headimages/agent/avatar/70cb59c6-351e-47ab-ba7d-df20d753f255.jpg',
    '--service', JSON.stringify(serviceObj)
];

console.log("Executing onchainos Agent pipeline with strict mapped payload...");
const result = spawnSync('C:\\Users\\USER\\.local\\bin\\onchainos.exe', args);

const out = result.stdout ? result.stdout.toString() : '';
const err = result.stderr ? result.stderr.toString() : '';
fs.writeFileSync('C:\\Users\\USER\\OneDrive\\Desktop\\new agent\\trustlens-ai\\cli_out.txt', out + '\n' + err);
console.log("Logged to cli_out.txt");
