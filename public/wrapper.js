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
    // add PWA stuff to head
    document.querySelector('head').innerHTML += `
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="PlaytilesPico8">
    <link rel="manifest" href="/manifest.webmanifest">
    <meta name="theme-color" content="#000000">

    <meta name="HandheldFriendly" content="true"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    `

    // Controls resize logic for #controls
    const controls = document.getElementById('controls');
    const resizeBtn = document.getElementById('resize-btn');

    let startY = null;
    let startScale = 1;
    let minScale = 0.6;
    let maxScale = 2.0;

    function setScale(scale) {
        controls.style.transform = `scale(${scale}) translateY(${-80 + 50 * scale}px)`;
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
    // 1. i need to stop original event listener
    // const originalPico8ButtonsEvent = window.pico8_buttons_event;
    window.pico8_buttons_event = function(event, state) {
    // noop
    };
    //P8_BUTTON_O

    const buttons =
        [
            document.querySelector('.dpad-btn.left'),
            document.querySelector('.dpad-btn.right'),
            document.querySelector('.dpad-btn.up'),
            document.querySelector('.dpad-btn.down'),
            document.querySelector('.ab-btn.o'),
            document.querySelector('.ab-btn.x')
        ];

    const state = [0, 0, 0, 0, 0, 0]
    buttons.forEach((btn, idx) => btn.addEventListener('touchstart', () => {
        state[idx] = 1
    }))
    buttons.forEach((btn, idx) => btn.addEventListener('touchend', () => {
        state[idx] = 0
    }))

    function step() {
        pico8_buttons[0] = 0
        const [left, right, up, down, x, o] = state;
        let b = 0;
        if (left) {
            b |= 0x1
        } else if (right) {
            b |= 0x2
        }
        if (up) {
            b |= 0x4;
        } else if (down) {
            b |= 0x8;
        }

        if (x) {
            b |= 0x10
        }
        if (o) {
            b |= 0x20
        }
        pico8_buttons[0] |= b;
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

(async function run() {
    loadStylesheet('wrapper.css')
    await loadHtml('wrapper.html')
    init();
}())