const cp = require('child_process');
const fs = require('fs');
try {
    const out = cp.execSync('okx-a2a doctor --fix --json').toString();
    fs.writeFileSync('doctorOut2.json', out, 'utf8');
} catch (e) {
    if (e.stdout) {
        fs.writeFileSync('doctorOut2.json', e.stdout.toString(), 'utf8');
    } else {
        console.error(e);
    }
}
