const { compile } = require('./webn/compiler');
const path = require('path');
const fs = require('fs-extra');

// This file will eventually be the bridge between the Editor and the OS/WebN
console.log('Orion Editor Backend initialized');

// Example of how we might call the compiler from the editor terminal
async function runBuild(projectPath) {
    const outputDir = path.join(projectPath, 'build');
    await compile(projectPath, outputDir, 'MyOrionApp');
}
