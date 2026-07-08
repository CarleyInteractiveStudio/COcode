const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs-extra');
const path = require('path');

async function compile(input, output) {
    if (!fs.existsSync(output)) fs.mkdirSync(output, { recursive: true });
    const files = await fs.readdir(input);
    for (const f of files) {
        if (['node_modules', 'dist', '.git'].includes(f)) continue;
        const p = path.join(input, f), d = path.join(output, f);
        if ((await fs.stat(p)).isDirectory()) await compile(p, d);
        else {
            let c = await fs.readFile(p, 'utf8');
            if (f.endsWith('.js')) c = JavaScriptObfuscator.obfuscate(c).getObfuscatedCode();
            await fs.writeFile(d, c);
        }
    }
}
if (require.main === module) compile(process.argv[2], process.argv[3]);
