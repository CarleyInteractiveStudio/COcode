document.addEventListener('mousedown', (e) => {
    const header = e.target.closest('.window-header');
    if (!header) return;

    const miniWin = header.parentElement;
    let shiftX = e.clientX - miniWin.getBoundingClientRect().left;
    let shiftY = e.clientY - miniWin.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        miniWin.style.left = pageX - shiftX + 'px';
        miniWin.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
    };
});

// Evitar arrastre por defecto de elementos
document.addEventListener('dragstart', (e) => {
    if (e.target.closest('.window-header')) e.preventDefault();
});
