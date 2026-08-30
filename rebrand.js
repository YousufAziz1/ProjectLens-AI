const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['.'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.html'];
const IGNORE_DIRS = ['node_modules', '.git', '.next', '.vercel'];

const REPLACEMENTS = [
    { target: /TrustLens-AI/g, replacement: 'TrustLens-AI' },
    { target: /TrustLens/g, replacement: 'TrustLens' },
    { target: /trustlens-ai/g, replacement: 'trustlens-ai' },
    { target: /trustlens/g, replacement: 'trustlens' }
];

function walk(dir) {
    if (IGNORE_DIRS.includes(path.basename(dir))) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else {
            const ext = path.extname(fullPath);
            if (EXTENSIONS.includes(ext) && file !== 'package-lock.json') {
                processFile(fullPath);
            }
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    for (const r of REPLACEMENTS) {
        if (r.target.test(content)) {
            content = content.replace(r.target, r.replacement);
            hasChanges = true;
        }
    }

    if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

DIRECTORIES.forEach(walk);
console.log('Rebranding complete.');
