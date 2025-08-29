//----------------------------------------------
// Layout helpers for top/bottom pane resizing

type PaneSizes = {
  topH: number;   // px
  bottomH: number;
  leftW: number;  // persisted but not modified here
  rightW: number;
};

const LSK = 'layout.v1';
export const DEFAULTS: PaneSizes = { topH: 60, bottomH: 110, leftW: 260, rightW: 300 };
const MIN_TOP = 40, MAX_TOP = 160;
const MIN_BOTTOM = 60, MAX_BOTTOM = 220;

function readSizes(): PaneSizes {
  try {
    return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(LSK) || '{}')) };
  } catch {
    return { ...DEFAULTS };
  }
}
function saveSizes(s: PaneSizes) { localStorage.setItem(LSK, JSON.stringify(s)); }

export function applySizes(s: PaneSizes) {
  const root = document.documentElement;
  root.style.setProperty('--topPaneHeight', `${s.topH}px`);
  root.style.setProperty('--bottomPaneHeight', `${s.bottomH}px`);
  root.style.setProperty('--leftPaneWidth', `${s.leftW}px`);
  root.style.setProperty('--rightPaneWidth', `${s.rightW}px`);
}

function makeHandle(id: string, cursor: string): HTMLElement {
  let el = document.getElementById(id) as HTMLElement | null;
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.className = 'pane-handle';
    document.body.appendChild(el);
  }
  el.style.cursor = cursor;
  el.style.position = 'absolute';
  el.style.left = '0';
  el.style.right = '0';
  el.style.height = '6px';
  el.style.zIndex = '5';
  el.style.background = 'transparent';
  el.style.pointerEvents = 'auto';
  return el;
}

export function initTopBottomResizers() {
  const sizes = readSizes();
  applySizes(sizes);

  const topHandle = makeHandle('handle-top', 'row-resize');
  const setTopHandlePos = () => { topHandle.style.top = `${sizes.topH - 3}px`; };
  setTopHandlePos();

  const bottomHandle = makeHandle('handle-bottom', 'row-resize');
  const viewportH = () => (document.documentElement.clientHeight || window.innerHeight);
  const setBottomHandlePos = () => { bottomHandle.style.top = `${viewportH() - sizes.bottomH - 3}px`; };
  setBottomHandlePos();

  let active: 'top' | 'bottom' | null = null;

  function onPointerMove(e: PointerEvent) {
    if (!active) return;
    const y = e.clientY;
    if (active === 'top') {
      sizes.topH = Math.max(MIN_TOP, Math.min(MAX_TOP, y));
    } else {
      sizes.bottomH = Math.max(MIN_BOTTOM, Math.min(MAX_BOTTOM, viewportH() - y));
    }
    applySizes(sizes);
    setTopHandlePos();
    setBottomHandlePos();
  }
  function onPointerUp() {
    if (!active) return;
    saveSizes(sizes);
    active = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }
  function start(kind: 'top' | 'bottom') {
    active = kind;
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
  }

  topHandle.onpointerdown = (e) => { e.preventDefault(); start('top'); };
  bottomHandle.onpointerdown = (e) => { e.preventDefault(); start('bottom'); };

  window.addEventListener('resize', () => { applySizes(sizes); setTopHandlePos(); setBottomHandlePos(); });
}

export function addRestoreButton() {
  const top = document.getElementById('paneTop');
  if (!top) return;
  let btn = document.getElementById('btn-restore-panes') as HTMLButtonElement | null;
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'btn-restore-panes';
    btn.textContent = 'Restore Panes';
    btn.className = 'restore-panes-btn';
    btn.title = 'Reset pane sizes to defaults';
    top.appendChild(btn);
  }
  btn.onclick = () => {
    const sizes = readSizes();
    sizes.topH = DEFAULTS.topH;
    sizes.bottomH = DEFAULTS.bottomH;
    if (sizes.leftW == null) sizes.leftW = DEFAULTS.leftW;
    if (sizes.rightW == null) sizes.rightW = DEFAULTS.rightW;
    saveSizes(sizes);
    applySizes(sizes);
  };
}

export function initLayout() {
  initTopBottomResizers();
  addRestoreButton();
}

