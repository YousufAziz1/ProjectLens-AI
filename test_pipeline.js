async function testProject(name, formDataObj) {
    console.log(`\n============================`);
    console.log(`🚀 Starting Test: ${name}`);
    console.log(`============================`);

    try {
        const formData = new FormData();
        for (const [k, v] of Object.entries(formDataObj)) {
            if (v) formData.append(k, v);
        }

        const res = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            body: formData
        });

        const text = await res.text();
        const events = text.split('\n\n');

        const completeEvent = events.find(e => e.includes('"stage":"Complete"'));
        if (completeEvent) {
            const successPayload = events.find(e => e.includes('"success":true'));
            if (successPayload) {
                const json = JSON.parse(successPayload.replace('data: ', ''));
                console.log(`✅ [${name}] COMPLETE! => ID: ${json.id}`);
            } else {
                console.log(`✅ [${name}] Complete event fired!`);
            }
        } else if (text.includes('error')) {
            console.log(`❌ [${name}] SSE EXITED WITH ERROR:`);
            console.log(text);
        } else {
            console.log(`⚠️ [${name}] DONE, NO MATCHING EVENT`);
        }
    } catch (e) {
        console.error(`❌ [${name}] HTTP Error: ${e.message}`);
    }
}

async function runTests() {
    await testProject('Arcus (Real Web3)', { websiteUrl: 'https://arcus.games', docsUrl: 'https://docs.arcus.games', githubUrl: 'https://github.com/arcus-games/frontend' });
    await testProject('Empty Protocol (Website Only)', { websiteUrl: 'https://vercel.com' });
}

runTests();
