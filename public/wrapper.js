function loadStylesheet(url) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
}

async function loadHtml(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);

        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        const newBodyChildren = Array.from(doc.body.children);
        newBodyChildren.forEach(el => document.body.appendChild(el));

    } catch (error) {
        console.error(error);
    }
}

function init() {
    // Controls resize logic for #controls
    const controls = document.getElementById('controls');
    const resizeBtn = document.getElementById('resize-btn');

    let startY = null;
    let startScale = 1;
    let minScale = 0.6;
    let maxScale = 2.0;

    function setScale(scale) {
        controls.style.transform = `scale(${scale}) translateY(${-80 + 50*scale}px)`;
        controls.dataset.scale = scale;
    }

    resizeBtn.addEventListener('pointerdown', (e) => {
        startY = e.clientY;
        startScale = parseFloat(controls.dataset.scale || '1');
        document.body.style.userSelect = 'none';

        function onPointerMove(ev) {
            const dy = ev.clientY - startY;
            let newScale = startScale + dy / 200;
            newScale = Math.max(minScale, Math.min(maxScale, newScale));
            setScale(newScale);
        }

        function onPointerUp() {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            document.body.style.userSelect = '';
        }

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    });

    // Initialize
    setScale(1);
    // controls listeners
    document.querySelector('.dpad-btn.left').addEventListener('touchstart', () => {
        pico8_buttons[0] = 1
    })
        document.querySelector('.dpad-btn.left').addEventListener('touchend', () => {
        pico8_buttons[0] = 0
    })
}

(async function run() {
    loadStylesheet('wrapper.css')
    await loadHtml('wrapper.html')
    init();
}())