const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function compile(inputDir, outputDir, appName = 'MyWebNApp') {
    console.log(`Compiling project from ${inputDir} to ${outputDir}...`);

    const stagingDir = path.join(__dirname, 'staging');
    const baseAppDir = path.join(__dirname, 'base_app');

    // 1. Setup staging area
    if (fs.existsSync(stagingDir)) fs.removeSync(stagingDir);
    fs.copySync(baseAppDir, stagingDir);

    // 2. Process and obfuscate user files into staging
    await processFiles(inputDir, stagingDir);

    // 3. Package with Electron Packager
    console.log('Packaging as executable...');
    try {
        // We use electron-packager to create the actual executable
        // Note: In a real environment, we'd need electron installed
        const cmd = `npx electron-packager ${stagingDir} ${appName} --out=${outputDir} --overwrite`;
        execSync(cmd, { stdio: 'inherit' });
        console.log(`Successfully compiled to ${outputDir}`);
    } catch (error) {
        console.error('Packaging failed:', error.message);
    } finally {
        fs.removeSync(stagingDir);
    }
}

async function processFiles(src, dest) {
    const files = await fs.readdir(src);
    for (const file of files) {
        const fullPath = path.join(src, file);
        const stats = await fs.stat(fullPath);
        const destPath = path.join(dest, file);

        if (stats.isDirectory()) {
            fs.mkdirpSync(destPath);
            await processFiles(fullPath, destPath);
        } else {
            const ext = path.extname(file);
            let content = await fs.readFile(fullPath, 'utf8');

            if (ext === '.js') {
                console.log(`Obfuscating ${file}...`);
                const obfuscationResult = JavaScriptObfuscator.obfuscate(content, {
                    compact: true,
                    controlFlowFlattening: true,
                    stringArray: true,
                    stringArrayEncoding: ['base64']
                });
                content = obfuscationResult.getObfuscatedCode();
            }
            await fs.writeFile(destPath, content);
        }
    }
}

// CLI
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length >= 2) {
        compile(args[0], args[1], args[2] || 'WebNApp');
    } else {
        console.log('Usage: node compiler.js <inputDir> <outputDir> [appName]');
    }
}

module.exports = { compile };
