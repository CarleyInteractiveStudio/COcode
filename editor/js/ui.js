document.addEventListener('DOMContentLoaded', () => {
    initFileExplorer();
    initTerminal();
});

function initFileExplorer() {
    const explorer = document.querySelector('.file-list');
    const files = [
        { name: 'index.html', type: 'file' },
        { name: 'style.css', type: 'file' },
        { name: 'main.orion', type: 'file' },
        { name: 'assets', type: 'folder' }
    ];

    files.forEach(file => {
        const div = document.createElement('div');
        div.className = `file-item ${file.type}`;
        div.innerHTML = `
            <span class="icon">${file.type === 'folder' ? '📁' : '📄'}</span>
            <span class="name">${file.name}</span>
        `;
        explorer.appendChild(div);
    });
}

function initTerminal() {
    const terminalToggle = document.querySelector('.terminal-toggle');
    terminalToggle.addEventListener('click', () => {
        toggleTerminal();
    });
}

function toggleTerminal() {
    let terminal = document.getElementById('terminal-window');
    if (terminal) {
        terminal.style.display = terminal.style.display === 'none' ? 'flex' : 'none';
    } else {
        createTerminalWindow();
    }
}

function createTerminalWindow() {
    const container = document.getElementById('window-system-container');
    const term = document.createElement('div');
    term.id = 'terminal-window';
    term.className = 'mini-window terminal-window';
    term.style.top = '400px';
    term.style.left = '100px';
    term.style.width = '700px';
    term.style.height = '200px';

    term.innerHTML = `
        <div class="window-header">
            <span class="window-title">Terminal - WebN</span>
            <div class="window-actions">
                <button class="win-btn close-win">×</button>
            </div>
        </div>
        <div class="window-content terminal-content">
            <div class="terminal-output">> Orion Terminal Ready...</div>
            <div class="terminal-input-line">
                <span class="prompt">$</span>
                <input type="text" class="terminal-input" autofocus>
            </div>
        </div>
    `;

    container.appendChild(term);

    const closeBtn = term.querySelector('.close-win');
    closeBtn.addEventListener('click', () => term.remove());

    const input = term.querySelector('.terminal-input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value;
            handleCommand(cmd, term.querySelector('.terminal-output'));
            input.value = '';
        }
    });
}

function handleCommand(cmd, output) {
    const line = document.createElement('div');
    line.textContent = `$ ${cmd}`;
    output.appendChild(line);

    if (cmd === 'webn build') {
        const buildMsg = document.createElement('div');
        buildMsg.textContent = 'Iniciando WebN Compiler...';
        buildMsg.style.color = '#27c93f';
        output.appendChild(buildMsg);

        const progress = document.createElement('div');
        progress.textContent = '[░░░░░░░░░░] 0%';
        output.appendChild(progress);

        let p = 0;
        const interval = setInterval(() => {
            p += 20;
            const bar = '█'.repeat(p/10) + '░'.repeat(10 - p/10);
            progress.textContent = `[${bar}] ${p}%`;

            if (p === 40) {
                const msg = document.createElement('div');
                msg.textContent = '-> Ofuscando archivos JS...';
                output.appendChild(msg);
            }
            if (p === 80) {
                const msg = document.createElement('div');
                msg.textContent = '-> Empaquetando en ejecutable...';
                output.appendChild(msg);
            }

            if (p >= 100) {
                clearInterval(interval);
                const doneMsg = document.createElement('div');
                doneMsg.textContent = '¡Build Exitoso! El ejecutable se ha generado en la carpeta /dist';
                doneMsg.style.color = '#27c93f';
                output.appendChild(doneMsg);
            }
        }, 500);
    } else if (cmd === 'help') {
        const helpMsg = document.createElement('div');
        helpMsg.innerHTML = 'Available commands: help, clear, webn build';
        output.appendChild(helpMsg);
    } else if (cmd === 'clear') {
        output.innerHTML = '';
    }
}
