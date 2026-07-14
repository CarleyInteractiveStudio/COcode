let currentProjectDir = null;
let currentFile = null;
let openFilesMap = {}; // path -> content

function isNativeEnv() {
    return typeof Neutralino !== 'undefined' && typeof window.NL_PORT !== 'undefined';
}

// Dialog para abrir una carpeta (proyecto) completa
async function openFolderDialog() {
    if (!isNativeEnv()) {
        console.log("No en entorno nativo. Simulando carpeta del proyecto.");
        simulateProjectDir();
        return;
    }

    try {
        let entry = await Neutralino.os.showFolderDialog('Selecciona la Carpeta del Proyecto');
        if (entry) {
            currentProjectDir = entry;
            showNotification(`Proyecto abierto: ${entry}`);
            await loadProjectFiles(entry);
        }
    } catch (e) {
        console.log("Error o cancelado. Simulando carpeta del proyecto.");
        simulateProjectDir();
    }
}

// Simulador para desarrollo web o pruebas
function simulateProjectDir() {
    currentProjectDir = "/mi-proyecto";
    showNotification("Proyecto simulado abierto");
    const fakeFiles = [
        { name: "index.html", path: "/mi-proyecto/index.html", type: "file" },
        { name: "app.js", path: "/mi-proyecto/app.js", type: "file" },
        { name: "style.css", path: "/mi-proyecto/style.css", type: "file" }
    ];
    renderFileList(fakeFiles);
}

// Cargar jerarquía de archivos recursivamente
async function loadProjectFiles(dirPath) {
    if (!isNativeEnv()) {
        simulateProjectDir();
        return;
    }

    try {
        let entries = await Neutralino.filesystem.readDirectory(dirPath);
        let files = [];
        for (let entry of entries) {
            if (entry.entry === '.' || entry.entry === '..') continue;
            const fullPath = `${dirPath}/${entry.entry}`;
            files.push({
                name: entry.entry,
                path: fullPath,
                type: entry.type === 'DIRECTORY' ? 'dir' : 'file'
            });
        }
        // Ordenar carpetas primero, luego archivos
        files.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'dir' ? -1 : 1;
        });
        renderFileList(files);
    } catch (e) {
        console.error("Error al leer directorio:", e);
        showNotification("Error al abrir directorio del proyecto", 4000);
    }
}

function renderFileList(files) {
    const listContainer = document.getElementById('explorer-list');
    if (!listContainer) return;

    if (files.length === 0) {
        listContainer.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-size: 12px; text-align: center;">Carpeta vacía</div>`;
        return;
    }

    listContainer.innerHTML = '';
    files.forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-item';
        if (currentFile === file.path) item.classList.add('active');

        const icon = file.type === 'dir' ? '📁' : getFileIcon(file.name);
        item.innerHTML = `<span class="file-icon">${icon}</span> <span>${file.name}</span>`;

        item.onclick = () => {
            if (file.type === 'dir') {
                showNotification(`Entrando a carpeta: ${file.name}`);
                loadProjectFiles(file.path);
            } else {
                openFileByPath(file.path, file.name);
            }
        };

        listContainer.appendChild(item);
    });
}

function getFileIcon(name) {
    if (name.endsWith('.html')) return '🌐';
    if (name.endsWith('.js')) return '🟨';
    if (name.endsWith('.css')) return '🎨';
    if (name.endsWith('.json')) return '⚙️';
    return '📄';
}

// Abrir un archivo específico
async function openFileDialog() {
    if (!isNativeEnv()) {
        console.log("No en entorno nativo. Abriendo archivo de ejemplo.");
        const name = prompt("Nombre del archivo simulado:", "app.js");
        if (name) {
            await openFileByPath(`/simulado/${name}`, name, `// Código inicial para ${name}\nconsole.log("Hola Mundo");`);
        }
        return;
    }

    try {
        let entries = await Neutralino.os.showOpenDialog('Abrir Archivo');
        if (entries && entries.length) {
            const filePath = entries[0];
            const name = filePath.split('/').pop();
            await openFileByPath(filePath, name);
        }
    } catch (e) {
        console.log("No se pudo abrir el archivo.");
    }
}

async function openFileByPath(filePath, name, defaultContent = "") {
    currentFile = filePath;
    let content = defaultContent;

    if (!openFilesMap[filePath]) {
        if (isNativeEnv()) {
            try {
                content = await Neutralino.filesystem.readFile(filePath);
            } catch (e) {
                console.log("Error al leer archivo real.");
            }
        }
        openFilesMap[filePath] = content;
    } else {
        content = openFilesMap[filePath];
    }

    // Actualizar editor de código
    const editor = document.getElementById('code-editor');
    if (editor) {
        editor.innerText = content;
        updateHighlighting();
    }

    // Actualizar pestañas
    updateTabs(name, filePath);

    // Resaltar en la lista lateral
    document.querySelectorAll('.file-item').forEach(item => {
        if (item.innerText.includes(name)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    showNotification(`Archivo abierto: ${name}`);
}

function updateTabs(name, filePath) {
    const tabsContainer = document.getElementById('editor-tabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = `
        <div class="tab active" title="${filePath}">
            <span>${name}</span>
            <span class="tab-close" onclick="event.stopPropagation(); closeCurrentTab();">&times;</span>
        </div>
    `;
}

function closeCurrentTab() {
    const editor = document.getElementById('code-editor');
    if (editor) editor.innerText = '';
    currentFile = null;
    const tabsContainer = document.getElementById('editor-tabs');
    if (tabsContainer) {
        tabsContainer.innerHTML = `
            <div class="tab active" id="tab-empty">
                <span>nuevo.html</span>
            </div>
        `;
    }
    showNotification("Pestaña cerrada");
}

// Guardar archivo activo
async function saveCurrentFile() {
    const editor = document.getElementById('code-editor');
    if (!editor) return;

    const content = editor.innerText;

    if (!currentFile) {
        if (!isNativeEnv()) {
            const name = prompt("Guardar como (nombre de archivo):", "nuevo.html");
            if (!name) return;
            currentFile = (currentProjectDir || "/mi-proyecto") + "/" + name;
        } else {
            try {
                let selected = await Neutralino.os.showSaveDialog('Guardar Archivo');
                if (selected) {
                    currentFile = selected;
                } else {
                    return;
                }
            } catch (e) {
                return;
            }
        }
    }

    if (isNativeEnv()) {
        try {
            await Neutralino.filesystem.writeFile(currentFile, content);
            openFilesMap[currentFile] = content;
            const name = currentFile.split('/').pop();
            updateTabs(name, currentFile);
            showNotification(`Archivo guardado: ${name}`);
        } catch (e) {
            console.error("Error al guardar archivo real:", e);
        }
    } else {
        openFilesMap[currentFile] = content;
        const name = currentFile.split('/').pop();
        updateTabs(name, currentFile);
        showNotification(`Simulado guardado: ${name}`);
    }
}

// Crear un archivo nuevo
async function createNewFilePrompt() {
    const name = prompt("Nombre del nuevo archivo:");
    if (!name) return;

    const basePath = currentProjectDir || "/mi-proyecto";
    const fullPath = `${basePath}/${name}`;

    if (isNativeEnv()) {
        try {
            await Neutralino.filesystem.writeFile(fullPath, `<!-- ${name} -->\n`);
            showNotification(`Archivo creado: ${name}`);
            await loadProjectFiles(currentProjectDir);
            await openFileByPath(fullPath, name, `<!-- ${name} -->\n`);
        } catch (e) {
            console.error(e);
        }
    } else {
        openFilesMap[fullPath] = `<!-- ${name} simulado -->\n`;
        showNotification(`Simulado creado: ${name}`);
        await openFileByPath(fullPath, name, `<!-- ${name} simulado -->\n`);
    }
}

// Comando de Terminal
async function executeTerminalCommand(cmd) {
    if (!isNativeEnv()) {
        console.log(`Ejecutando comando en consola: ${cmd}`);
        if (cmd === 'ls' || cmd === 'dir') {
            return "index.html\napp.js\nstyle.css\nlibs/\n";
        }
        return `Comando simulado: '${cmd}' ejecutado con éxito.`;
    }

    try {
        let res = await Neutralino.os.execCommand(cmd);
        return res.stdOut || res.stdErr || "Comando ejecutado con éxito sin salida.";
    } catch (e) {
        return `Error al ejecutar: ${e.message || e}`;
    }
}
