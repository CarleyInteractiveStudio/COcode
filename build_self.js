const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

async function selfCompile() {
    const projectRoot = path.resolve(__dirname);
    const distDir = path.join(projectRoot, 'dist_cocode');
    if (fs.existsSync(distDir)) fs.removeSync(distDir);
    fs.mkdirSync(distDir);
    const filesToCopy = ['editor', 'neutralino.config.json', 'README.md', 'webn', 'build_self.js', 'extensions'];
    for (const item of filesToCopy) {
        const src = path.join(projectRoot, item);
        const dest = path.join(distDir, item);
        if (fs.existsSync(src)) fs.copySync(src, dest);
    }
    console.log('COcode auto-compilado en /dist_cocode');
}
if (require.main === module) selfCompile();
