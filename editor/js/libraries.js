// Mapa de CDN populares
const POPULAR_LIBS = {
    'axios': 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.8/axios.min.js',
    'tailwind': 'https://cdn.tailwindcss.com',
    'font-awesome': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'chart.js': 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js',
    'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
};

// Descargar una librería predefinida
async function downloadPredefined(key) {
    const url = POPULAR_LIBS[key];
    if (url) {
        document.getElementById('lib-input').value = url;
        await downloadCustomLibrary();
    }
}

// Descargar cualquier librería vía Fetch y guardarla localmente en /libs/
async function downloadCustomLibrary() {
    const input = document.getElementById('lib-input');
    let target = input.value.trim();
    if (!target) {
        showNotification("Escribe un nombre de paquete o URL", 3000);
        return;
    }

    // Si es un nombre sencillo de npm (sin barra ni protocolo), resolvemos vía unpkg CDN
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.includes('.')) {
        target = `https://unpkg.com/${target}`;
    }

    showNotification(`Descargando librería desde: ${target}...`);

    try {
        const response = await fetch(target);
        if (!response.ok) throw new Error("No se pudo obtener la librería desde el CDN.");

        const content = await response.text();

        // Extraer nombre de archivo elegante
        let fileName = target.split('/').pop().split('?')[0];
        if (!fileName || !fileName.includes('.')) {
            fileName = "library.js";
        }

        const projectDir = currentProjectDir || "/mi-proyecto";
        const libsFolder = `${projectDir}/libs`;
        const filePath = `${libsFolder}/${fileName}`;

        // Crear carpeta /libs y guardar archivo usando Neutralino
        try {
            await Neutralino.filesystem.createDirectory(libsFolder);
        } catch (e) {
            // Ya podría existir, ignorar
        }

        try {
            await Neutralino.filesystem.writeFile(filePath, content);
            showNotification(`Librería guardada con éxito en: /libs/${fileName}`, 4000);
        } catch (err) {
            // Entorno de simulación o navegador
            console.log(`Librería descargada simulada (${fileName}):`, content.substring(0, 100) + "...");
            showNotification(`Simulado: Librería guardada como /libs/${fileName}`, 4000);
        }

        // Recargar explorador de archivos si tenemos carpeta
        if (currentProjectDir) {
            await loadProjectFiles(currentProjectDir);
        } else {
            simulateProjectDir();
        }

        input.value = '';
        closeModal('modal-libraries');
    } catch (e) {
        console.error("Error al descargar librería:", e);
        showNotification(`Error: ${e.message}`, 4000);
    }
}
