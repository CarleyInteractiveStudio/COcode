document.addEventListener('mousedown', e => {
    let h = e.target.closest('.window-header');
    if(!h) return;
    let w = h.parentElement;
    let sx = e.clientX - w.offsetLeft, sy = e.clientY - w.offsetTop;
    let mv = ev => { w.style.left = (ev.clientX - sx) + 'px'; w.style.top = (ev.clientY - sy) + 'px'; };
    document.addEventListener('mousemove', mv);
    document.onmouseup = () => document.removeEventListener('mousemove', mv);
});
