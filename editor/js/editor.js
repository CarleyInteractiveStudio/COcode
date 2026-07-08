const editor = document.getElementById('code-editor');

editor.addEventListener('input', () => {
    updateHighlighting();
});

editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        insertTextAtCursor('    ');
    }
});

function insertTextAtCursor(text) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    selection.removeAllRanges();
    selection.addRange(range);
}

function updateHighlighting() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    const startContainer = range.startContainer;

    // This is a naive implementation. For a professional editor,
    // we'd use a hidden textarea or a more complex DOM management.
    // For "simple from zero", we will just do basic keyword coloring on input.

    // save cursor position is tricky with innerHTML
    // For now, let's keep it simple and just color keywords if they are typed.
}

// Resaltado para Orion
const orionKeywords = ['star', 'nebula', 'void', 'constellation', 'orbit'];

function highlightOrion(text) {
    let html = text;
    orionKeywords.forEach(kw => {
        const reg = new RegExp(`\\b${kw}\\b`, 'g');
        html = html.replace(reg, `<span class="keyword orion">${kw}</span>`);
    });
    return html;
}
