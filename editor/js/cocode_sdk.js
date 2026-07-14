/**
 * COcode SDK & Browser Polyfills
 * Permite que cualquier aplicación web estándar corra nativamente sin cambios.
 * Mapea APIs del navegador a llamadas nativas o interfaces elegantes en COcode.
 */

const COcodeSDK = {
    hardware: {
        async getMemory() {
            return new Promise((resolve) => {
                try {
                    const handler = (data) => {
                        if (data.detail && data.detail.event === 'memoryInfo') {
                            Neutralino.events.off('js.cocode.hardware', handler);
                            resolve(data.detail.data);
                        }
                    };
                    Neutralino.events.on('js.cocode.hardware', handler);
                    Neutralino.extensions.dispatch('js.cocode.hardware', 'getMemory');
                } catch(e) {
                    // Simulación o valor por defecto
                    resolve("8192 MB");
                }
            });
        },
        async ping() {
            try {
                Neutralino.extensions.dispatch('js.cocode.hardware', 'ping');
            } catch(e) {
                console.log("C++ Bridge Ping simulado");
            }
        },
        async getCPU() {
            return new Promise((resolve) => {
                try {
                    const handler = (data) => {
                        if (data.detail && data.detail.event === 'cpuInfo') {
                            Neutralino.events.off('js.cocode.hardware', handler);
                            resolve(data.detail.data);
                        }
                    };
                    Neutralino.events.on('js.cocode.hardware', handler);
                    Neutralino.extensions.dispatch('js.cocode.hardware', 'getCPU');
                } catch(e) {
                    // Simulación o valor por defecto
                    resolve({ cores: 8, usage: (Math.random() * 25 + 5).toFixed(1) });
                }
            });
        }
    },
    app: {
        exit() {
            try { Neutralino.app.exit(); } catch(e) { window.close(); }
        },
        minimize() {
            try { Neutralino.window.minimize(); } catch(e) { console.log("Minimizar no soportado en navegador"); }
        }
    }
};

// Inyectar el SDK globalmente en window para que esté disponible en cualquier script
window.COcode = COcodeSDK;

// --- POLYFILLS PARA NATIVE-TO-BROWSER TRANSPARENCY ---
// Permite que las aplicaciones web estándar que corren dentro del editor usen APIs del navegador
// y se traduzcan automáticamente en diálogos o notificaciones nativas de Neutralino si es posible.

// 1. Polyfill para alert, confirm, prompt de forma nativa
if (typeof Neutralino !== 'undefined') {
    const originalAlert = window.alert;
    window.alert = async function(message) {
        try {
            await Neutralino.os.showMessageBox('COcode Alerta', message, 'OK');
        } catch(e) {
            if (typeof showNotification === 'function') {
                showNotification(message);
            } else {
                console.log("Alert:", message);
            }
        }
    };

    const originalConfirm = window.confirm;
    window.confirm = async function(message) {
        try {
            let res = await Neutralino.os.showMessageBox('COcode Confirmar', message, 'OK_CANCEL');
            return res === 'OK';
        } catch(e) {
            return true;
        }
    };
}

// Escuchar eventos de la extensión
try {
    Neutralino.events.on('extensionReady', (data) => {
        console.log('COcode Extension Ready:', data.detail);
    });
} catch(e) {}
