const fs = require('fs');
const path = require('path');

const dirsToClean = ['controllers', 'routes', 'middlewares', 'config'];
const baseDir = path.join(__dirname, '../WOHO Back - DL');

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/^\s*\/\/.*$/gm, '');
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
        } else if (fullPath.endsWith('.js')) {
            cleanFile(fullPath);
        }
    }
}

for (const folder of dirsToClean) {
    traverse(path.join(baseDir, folder));
}
if (fs.existsSync(path.join(baseDir, 'index.js'))) {
    cleanFile(path.join(baseDir, 'index.js'));
}
console.log("Backend comments cleaned.");
