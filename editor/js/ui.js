document.querySelector('.terminal-toggle').onclick = () => {
    let container = document.getElementById('window-system-container');
    let t = document.createElement('div');
    t.className = 'mini-window';
    t.style.top = '300px';
    t.innerHTML = '<div class="window-header">Terminal</div><div class="window-content" style="background:#000;color:#0f0;"><div id="out"></div><input id="in" style="width:100%;background:0;border:0;color:#0f0;outline:0"></div>';
    container.appendChild(t);
    let i = t.querySelector('#in'), o = t.querySelector('#out');
    i.onkeydown = async e => {
        if(e.key === 'Enter') {
            o.innerHTML += `<div>$ ${i.value}</div>`;
            let r = await executeTerminalCommand(i.value);
            o.innerHTML += `<div>${r}</div>`;
            i.value = '';
        }
    };
};
