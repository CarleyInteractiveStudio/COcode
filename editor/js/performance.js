let performanceInterval = null;

async function startPerformanceMonitoring() {
    if (performanceInterval) return;

    // Primer check
    updatePerformanceData();

    performanceInterval = setInterval(updatePerformanceData, 1500);
}

async function updatePerformanceData() {
    const pane = document.getElementById('pane-performance');
    if (!pane || !pane.classList.contains('active')) {
        if (performanceInterval) {
            clearInterval(performanceInterval);
            performanceInterval = null;
        }
        return;
    }

    try {
        const cpu = await COcodeSDK.hardware.getCPU();
        const ram = await COcodeSDK.hardware.getMemory();

        if (cpu) {
            document.getElementById('perf-cpu-cores').innerText = cpu.cores || 'N/A';
            const usage = parseFloat(cpu.usage || 0);
            const usageStr = isNaN(usage) ? '0%' : usage.toFixed(1) + "%";
            document.getElementById('perf-cpu-usage').innerText = usageStr;
            document.getElementById('perf-cpu-bar').style.width = isNaN(usage) ? '0%' : usage + "%";
        }

        if (ram) {
            document.getElementById('perf-ram-total').innerText = ram;
        }
    } catch (e) {
        console.error("Error al obtener rendimiento:", e);
        document.getElementById('perf-cpu-cores').innerText = 'N/A';
        document.getElementById('perf-cpu-usage').innerText = 'No disponible';
        document.getElementById('perf-ram-total').innerText = 'No disponible';
    }
}
