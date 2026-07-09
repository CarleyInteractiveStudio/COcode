async function showPerformance() {
    const container = document.getElementById('window-system-container');
    const win = document.createElement('div');
    win.className = 'mini-window';
    win.style.width = '400px'; win.style.height = '300px';
    win.style.top = '100px'; win.style.left = '600px';

    win.innerHTML = `
        <div class="window-header"><span class="window-title">Monitor de Rendimiento C++</span></div>
        <div class="window-content" style="padding: 20px;">
            <div style="margin-bottom: 20px;">
                <strong>CPU Cores:</strong> <span id="perf-cpu-cores">...</span><br>
                <strong>CPU Load:</strong> <span id="perf-cpu-usage">0%</span>
                <div style="width:100%; height:10px; background:#333; margin-top:5px;">
                    <div id="perf-cpu-bar" style="width:0%; height:100%; background:#0f0; transition:width 0.5s;"></div>
                </div>
            </div>
            <div>
                <strong>RAM Total:</strong> <span id="perf-ram-total">...</span>
            </div>
            <div style="margin-top:20px; font-size:10px; color:#888;">
                Datos obtenidos directamente vía C++ Bridge
            </div>
        </div>`;
    container.appendChild(win);

    const updateInterval = setInterval(async () => {
        if(!document.body.contains(win)) {
            clearInterval(updateInterval);
            return;
        }

        const cpu = await COcodeSDK.hardware.getCPU();
        const ram = await COcodeSDK.hardware.getMemory();

        document.getElementById('perf-cpu-cores').innerText = cpu.cores;
        const usage = parseFloat(cpu.usage).toFixed(1);
        document.getElementById('perf-cpu-usage').innerText = usage + "%";
        document.getElementById('perf-cpu-bar').style.width = usage + "%";
        document.getElementById('perf-ram-total').innerText = ram;
    }, 1000);
}
