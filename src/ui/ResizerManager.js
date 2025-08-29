import { readSizes, applySizes, saveSizes, DEFAULTS } from './layout.ts';

export function initResizers() {
  const sizes = readSizes();
  applySizes(sizes);

  const handles = {
    left: document.querySelector('#paneLeft .handle-e'),
    right: document.querySelector('#paneRight .handle-w'),
    top: document.querySelector('#paneTop .handle-s'),
    bottom: document.querySelector('#paneBottom .handle-n'),
  };

  let active = null;
  let startX = 0, startY = 0;
  const limits = {
    left: { min: 180, max: 600 },
    right: { min: 180, max: 600 },
    top: { min: 40, max: 160 },
    bottom: { min: 60, max: 220 },
  };

  function onPointerMove(e) {
    if (!active) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    switch (active) {
      case 'left':
        sizes.leftW = Math.max(limits.left.min, Math.min(limits.left.max, sizes.leftW + dx));
        break;
      case 'right':
        sizes.rightW = Math.max(limits.right.min, Math.min(limits.right.max, sizes.rightW - dx));
        break;
      case 'top':
        sizes.topH = Math.max(limits.top.min, Math.min(limits.top.max, sizes.topH + dy));
        break;
      case 'bottom':
        sizes.bottomH = Math.max(limits.bottom.min, Math.min(limits.bottom.max, sizes.bottomH - dy));
        break;
    }
    applySizes(sizes);
  }

  function onPointerUp() {
    if (!active) return;
    saveSizes(sizes);
    active = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }

  function start(kind, e) {
    active = kind;
    startX = e.clientX;
    startY = e.clientY;
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    e.preventDefault();
  }

  Object.entries(handles).forEach(([kind, el]) => {
    if (el) el.addEventListener('pointerdown', (e) => start(kind, e));
  });

  window.addEventListener('resize', () => applySizes(sizes));
}

export function resetSizes() {
  saveSizes(DEFAULTS);
  applySizes(DEFAULTS);
}
