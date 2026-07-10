function changeTheme(themeName) {
    const body = document.body;
    if (themeName === 'light') {
        body.className = 'theme-light';
        const label = document.getElementById('current-theme-label');
        if (label) label.innerText = "Tema: Claro";
        localStorage.setItem('cocode-theme', 'light');
    } else {
        body.className = 'theme-dark';
        const label = document.getElementById('current-theme-label');
        if (label) label.innerText = "Tema: Oscuro";
        localStorage.setItem('cocode-theme', 'dark');
    }
    showNotification("Tema cambiado con éxito");
}

function loadSavedTheme() {
    const saved = localStorage.getItem('cocode-theme') || 'dark';
    const select = document.getElementById('theme-select');
    if (select) {
        select.value = saved;
    }
    changeTheme(saved);
}

// Cargar tema guardado al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadSavedTheme();
});
