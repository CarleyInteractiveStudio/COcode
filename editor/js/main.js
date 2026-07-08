let currentFile = null;
async function openFile() {
    try {
        let entries = await Neutralino.os.showOpenDialog('Abrir');
        if(entries.length) {
            currentFile = entries[0];
            let content = await Neutralino.filesystem.readFile(currentFile);
            document.getElementById('code-editor').innerText = content;
        }
    } catch(e) {}
}
async function saveCurrentFile() {
    try {
        let content = document.getElementById('code-editor').innerText;
        if(!currentFile) currentFile = await Neutralino.os.showSaveDialog('Guardar');
        if(currentFile) await Neutralino.filesystem.writeFile(currentFile, content);
    } catch(e) {}
}
async function executeTerminalCommand(cmd) {
    try {
        let res = await Neutralino.os.execCommand(cmd);
        return res.stdOut || res.stdErr;
    } catch(e) { return e.message; }
}
