const fs = require('fs/promises');

const TARGETS = [
    { name: 'Uniswap V3', websiteUrl: 'https://uniswap.org', docsUrl: 'https://docs.uniswap.org', githubUrl: 'https://github.com/Uniswap/v3-core' },
    { name: 'Aave V3', websiteUrl: 'https://aave.com', docsUrl: 'https://docs.aave.com', githubUrl: 'https://github.com/aave/aave-v3-core' },
    { name: 'Moonwell Fi', websiteUrl: 'https://moonwell.fi', docsUrl: 'https://docs.moonwell.fi', githubUrl: 'https://github.com/moonwell-fi' },
    { name: 'Arcus Games', websiteUrl: 'https://arcus.games', docsUrl: 'https://docs.arcus.games', githubUrl: 'https://github.com/arcus-games/frontend' },
    { name: 'Chainlink', websiteUrl: 'https://chain.link', docsUrl: 'https://docs.chain.link', githubUrl: 'https://github.com/smartcontractkit/chainlink' },
    { name: 'Vercel (Website Only)', websiteUrl: 'https://vercel.com', docsUrl: '', githubUrl: '' },
    { name: 'Tether (No Open Tracker)', websiteUrl: 'https://tether.to', docsUrl: '', githubUrl: '' },
    { name: 'Fake Invalid Protocol', websiteUrl: 'https://thisdoesnotexist-1234.com', docsUrl: 'https://thisdoesnotexist-1234.com/docs', githubUrl: 'https://github.com/null/null' },
    { name: 'Prisma Finance', websiteUrl: 'https://prismafinance.com', docsUrl: 'https://docs.prismafinance.com', githubUrl: 'https://github.com/prisma-fi' },
    { name: 'Only Code (Rust)', websiteUrl: '', docsUrl: '', githubUrl: 'https://github.com/rust-lang/rust' }
];

async function testProject(target) {
    const start = Date.now();
    try {
        const formData = new FormData();
        if (target.websiteUrl) formData.append('websiteUrl', target.websiteUrl);
        if (target.docsUrl) formData.append('docsUrl', target.docsUrl);
        if (target.githubUrl) formData.append('githubUrl', target.githubUrl);

        const res = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            body: formData
        });

        const text = await res.text();
        const events = text.split('\n\n');
        const runtime = Date.now() - start;

        const completeEvent = events.find(e => e.includes('"stage":"Complete"'));
        if (completeEvent) {
            const successPayload = events.find(e => e.includes('"success":true'));
            if (successPayload) {
                const json = JSON.parse(successPayload.replace('data: ', ''));
                // Read the report file natively from disk for data validation!
                const reportBlob = await fs.readFile(`.projectlens-data/${json.id}.json`, 'utf8');
                const report = JSON.parse(reportBlob);
                return { target, success: true, runtime, report };
            }
        }

        return { target, success: false, runtime, error: 'SSE Stream Failed' };
    } catch (e) {
        return { target, success: false, runtime: Date.now() - start, error: e.message };
    }
}

async function run() {
    console.log("🚀 Starting Massive 10-Target Calibration Suite...");

    // We will run them sequentially to avoid detonating our RAM/Rate Limits instantly
    const results = [];
    for (const tgt of TARGETS) {
        console.log(`Analyzing: ${tgt.name}...`);
        const r = await testProject(tgt);
        results.push(r);
        console.log(`=> Result: ${r.success ? '✅ SUCCESS' : '❌ FAILED'}`);
        // Add a 2 sec delay between calls to mitigate GH limit bursts
        await new Promise(r => setTimeout(r, 2000));
    }

    await fs.writeFile('calibration_payload.json', JSON.stringify(results, null, 2));
    console.log("💾 calibration_payload.json generated.");
}

run();
