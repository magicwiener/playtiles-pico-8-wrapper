// Controls resize logic for #controls
const controls = document.getElementById('controls');
const resizeBtn = document.getElementById('resize-btn');

let startY = null;
let startScale = 1;
let minScale = 0.6;
let maxScale = 2.0;

function setScale(scale) {
  controls.style.transform = `scale(${scale})`;
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
