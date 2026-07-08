const themes = {
    'dark-purple': {
        '--bg-dark': '#1a1a2e',
        '--bg-purple': '#16213e',
        '--accent-purple': '#4e31aa',
        '--text-color': '#e2e2e2',
        '--header-bg': '#0f3460',
        '--sidebar-bg': '#1a1a2e'
    },
    'midnight': {
        '--bg-dark': '#000428',
        '--bg-purple': '#004e92',
        '--accent-purple': '#00d2ff',
        '--text-color': '#ffffff',
        '--header-bg': '#000428',
        '--sidebar-bg': '#000428'
    },
    'emerald': {
        '--bg-dark': '#061700',
        '--bg-purple': '#0b3200',
        '--accent-purple': '#1b5e20',
        '--text-color': '#a5d6a7',
        '--header-bg': '#061700',
        '--sidebar-bg': '#061700'
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(key, value);
    }
}

// In ui.js or main.js
document.querySelector('.menu-item:nth-child(3)').addEventListener('click', () => {
    showConfig();
});

function showConfig() {
    const container = document.getElementById('window-system-container');
    const configWin = document.createElement('div');
    configWin.className = 'mini-window config-window';
    configWin.style.top = '100px';
    configWin.style.left = '200px';
    configWin.style.width = '400px';
    configWin.style.height = '300px';

    configWin.innerHTML = `
        <div class="window-header">
            <span class="window-title">Configuración de Temas</span>
            <div class="window-actions">
                <button class="win-btn close-win">×</button>
            </div>
        </div>
        <div class="window-content" style="padding: 20px;">
            <h3>Selecciona un Tema:</h3>
            <div class="theme-options" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
                <button onclick="applyTheme('dark-purple')" style="padding: 10px; cursor: pointer; background: #4e31aa; color: white; border: none; border-radius: 4px;">Morado Oscuro (Default)</button>
                <button onclick="applyTheme('midnight')" style="padding: 10px; cursor: pointer; background: #004e92; color: white; border: none; border-radius: 4px;">Midnight Blue</button>
                <button onclick="applyTheme('emerald')" style="padding: 10px; cursor: pointer; background: #1b5e20; color: white; border: none; border-radius: 4px;">Emerald Dark</button>
            </div>
        </div>
    `;

    container.appendChild(configWin);
    configWin.querySelector('.close-win').addEventListener('click', () => configWin.remove());
}
