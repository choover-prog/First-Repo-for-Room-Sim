import { resetSizes } from './layout.ts';

const LayoutManager = (() => {
  const panes = new Map();
  const collapsedStack = [];
  let activeFS = null;

  function registerPane(id, el) {
    panes.set(id, { id, el, collapsed: false, fullscreen: false });
  }

  function updateRestoreButton() {
    const btn = document.getElementById('btnRestorePane');
    if (!btn) return;
    btn.disabled = collapsedStack.length === 0;
  }

  function saveState() {
    try {
      const state = getState();
      localStorage.setItem('layout.state', JSON.stringify(state));
    } catch (_) {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem('layout.state');
      if (!raw) return;
      const state = JSON.parse(raw);
      if (state && state.panes) {
        Object.entries(state.panes).forEach(([id, st]) => {
          if (st.collapsed) setCollapsed(id, true);
        });
      }
    } catch (_) {}
  }

  function init(root = document) {
    root.querySelectorAll('.pane').forEach((el) => {
      const id = el.dataset.paneId || el.id;
      if (id) registerPane(id, el);
    });
    if (!document.fullscreenElement) {
      document.querySelectorAll('.pane.is-fullscreen').forEach((p) => p.classList.remove('is-fullscreen'));
      document.body.classList.remove('app-has-fullscreen');
    }
    loadState();
    updateRestoreButton();
  }

  function setCollapsed(id, bool) {
    const pane = panes.get(id);
    if (!pane) return;
    pane.collapsed = bool;
    const el = pane.el;
    const isSide = id === 'left' || id === 'right';
    const sizeProp = isSide ? 'width' : 'height';
    const collapsedSize = isSide ? '16px' : id === 'bottom' ? '18px' : '22px';

    if (bool && !el.dataset.prevSize) {
      const rect = el.getBoundingClientRect();
      const cur = (isSide ? rect.width : rect.height) + 'px';
      el.dataset.prevSize = cur;
    }

    const body = el.querySelector('.pane-body');
    if (body) {
      body.classList.toggle('is-collapsed', bool);
      if (bool) body.setAttribute('aria-hidden', 'true');
      else body.removeAttribute('aria-hidden');
    }

    const btn = el.querySelector('.btn-collapse');
    if (btn) {
      if (bool) {
        btn.textContent = id === 'left' ? '▶' : id === 'right' ? '◀' : id === 'top' ? '▼' : '▲';
      } else {
        btn.textContent = '▾';
      }
    }

    if (bool) {
      el.style[sizeProp] = collapsedSize;
      collapsedStack.push(id);
      const hint = document.createElement('div');
      hint.className = 'restore-hint';
      hint.setAttribute('aria-live', 'polite');
      hint.textContent = 'Pane collapsed. Use Restore.';
      el.appendChild(hint);
      setTimeout(() => hint.remove(), 2000);
    } else {
      const prev = el.dataset.prevSize;
      if (prev) {
        el.style[sizeProp] = prev;
        delete el.dataset.prevSize;
      }
      const idx = collapsedStack.lastIndexOf(id);
      if (idx >= 0) collapsedStack.splice(idx, 1);
    }
    updateRestoreButton();
    saveState();
  }

  async function setFullscreen(id, bool) {
    const pane = panes.get(id);
    if (!pane) return;
    pane.fullscreen = bool;
    const el = pane.el;
    if (bool) {
      activeFS = id;
      el.classList.add('is-fullscreen');
      document.body.classList.add('app-has-fullscreen');
      try { await el.requestFullscreen?.(); } catch (_) {}
      let btn = el.querySelector('.btn-exit-fullscreen');
      if (!btn) {
        btn = document.createElement('button');
        btn.className = 'btn-exit-fullscreen';
        btn.textContent = 'Exit';
        btn.setAttribute('aria-label', 'Exit Fullscreen');
        btn.addEventListener('click', () => setFullscreen(id, false));
        el.appendChild(btn);
      }
    } else {
      if (document.fullscreenElement === el) {
        try { await document.exitFullscreen(); } catch (_) {}
      }
      el.classList.remove('is-fullscreen');
      document.body.classList.remove('app-has-fullscreen');
      el.querySelector('.btn-exit-fullscreen')?.remove();
      activeFS = null;
    }
    saveState();
  }

  function restoreLastCollapsed() {
    const id = collapsedStack.pop();
    if (id) setCollapsed(id, false);
    updateRestoreButton();
  }

  function getState() {
    const panesState = {};
    panes.forEach((p) => {
      panesState[p.id] = { collapsed: p.collapsed, fullscreen: p.fullscreen };
    });
    return { panes: panesState, lastCollapsed: collapsedStack[collapsedStack.length - 1] || null, fullscreenId: activeFS };
  }

  function resetLayout() {
    localStorage.removeItem('layout.state');
    localStorage.removeItem('layout.v1');
    collapsedStack.length = 0;
    panes.forEach((p) => {
      const body = p.el.querySelector('.pane-body');
      if (body) {
        body.classList.remove('is-collapsed');
        body.removeAttribute('aria-hidden');
      }
      p.el.style.width = '';
      p.el.style.height = '';
      p.collapsed = false;
    });
    resetSizes();
    updateRestoreButton();
    saveState();
  }

  return { init, registerPane, setCollapsed, setFullscreen, restoreLastCollapsed, getState, resetLayout };
})();

export default LayoutManager;
