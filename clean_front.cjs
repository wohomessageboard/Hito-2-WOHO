const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/^\s*\/\/.*$/gm, '');
    content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    content = content.replace(/\n{3,}/g, '\n\n');
    fs.writeFileSync(filePath, content, 'utf8');
}

function traverse(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            cleanFile(fullPath);
        }
    }
}

traverse(srcDir);
console.log("Frontend comments cleaned.");
