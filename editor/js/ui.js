function showNotification(message, duration = 3000) {
    const toast = document.getElementById('toast-notif');
    const msg = document.getElementById('toast-message');
    if (toast && msg) {
        msg.innerText = message;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, duration);
    }
}

function switchBottomTab(tabName) {
    // Desactivar botones anteriores
    document.querySelectorAll('.bottom-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.bottom-pane').forEach(pane => pane.classList.remove('active'));

    // Activar nueva pestaña
    if (tabName === 'terminal') {
        document.querySelectorAll('.bottom-tab-btn')[0].classList.add('active');
        document.getElementById('pane-terminal').classList.add('active');
    } else if (tabName === 'performance') {
        document.querySelectorAll('.bottom-tab-btn')[1].classList.add('active');
        document.getElementById('pane-performance').classList.add('active');
        // Iniciar actualización de rendimiento si no está corriendo
        startPerformanceMonitoring();
    }
}

// Modales
function showConfigModal() {
    document.getElementById('modal-config').classList.add('active');
}

function showLibrariesModal() {
    document.getElementById('modal-libraries').classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Configuración de Terminal Integrada
const terminalIn = document.getElementById('terminal-in');
const terminalOut = document.getElementById('terminal-out');

if (terminalIn) {
    terminalIn.onkeydown = async e => {
        if (e.key === 'Enter') {
            const cmd = terminalIn.value.trim();
            if (!cmd) return;

            terminalOut.innerHTML += `<div style="color: var(--accent-light); margin-top: 4px;">$ ${cmd}</div>`;
            terminalIn.value = '';

            try {
                const res = await executeTerminalCommand(cmd);
                terminalOut.innerHTML += `<div style="white-space: pre-wrap; margin-bottom: 4px;">${res}</div>`;
            } catch (err) {
                terminalOut.innerHTML += `<div style="color: #ff5f56;">Error: ${err.message || err}</div>`;
            }
            terminalOut.scrollTop = terminalOut.scrollHeight;
        }
    };
}
