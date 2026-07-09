const COcodeSDK = {
    hardware: {
        async getMemory() {
            return new Promise((resolve) => {
                const handler = (event) => {
                    if (event.detail.event === 'memoryInfo') {
                        Neutralino.events.off('extensionReady', handler);
                        resolve(event.detail.data);
                    }
                };
                Neutralino.events.on('js.cocode.hardware', (data) => {
                    if(data.detail.event === 'memoryInfo') resolve(data.detail.data);
                });
                Neutralino.extensions.dispatch('js.cocode.hardware', 'getMemory');
            });
        },
        async ping() {
            Neutralino.extensions.dispatch('js.cocode.hardware', 'ping');
        }
    }
};

// Escuchar eventos de la extensión
Neutralino.events.on('extensionReady', (data) => {
    console.log('COcode Extension Ready:', data.detail);
});
