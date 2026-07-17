async function testHardware() {
    const mem = await COcodeSDK.hardware.getMemory();
    alert("Potencia de COcode detectada: " + mem + " de RAM disponibles para JS");
}
