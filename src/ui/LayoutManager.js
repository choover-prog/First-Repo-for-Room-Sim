const LayoutManager = {
  panes: new Map(),
  lastCollapsed: [],
  activeFullscreen: null,
  init(root = document) {
    if (!document.fullscreenElement) {
      root.querySelectorAll('.pane.is-fullscreen').forEach(p => p.classList.remove('is-fullscreen'));
      document.body.classList.remove('app-has-fullscreen');
    }
    root.querySelectorAll('.pane').forEach(el => {
      const id = el.dataset.paneId || el.id;
      this.registerPane(id, el);
      // ensure collapse button has class
      const c = el.querySelector('.collapse-toggle');
      if (c) c.classList.add('btn-collapse');
    });
    this._injectStyles();
    try {
      const saved = sessionStorage.getItem('layout.state');
      if (saved) {
        const state = JSON.parse(saved);
        state.forEach(({ id, collapsed, fullscreen }) => {
          if (collapsed) this.setCollapsed(id, true);
          if (fullscreen) this.setFullscreen(id, true);
        });
      }
    } catch (e) {
      console.warn('Layout state restore failed', e);
    }
  },
  registerPane(id, el) {
    if (!id || !el) return;
    this.panes.set(id, { id, el, collapsed: false, fullscreen: false });
    el.dataset.paneId = id;
    const body = el.querySelector('.pane-body');
    if (body) body.setAttribute('aria-hidden', 'false');
  },
  _saveState() {
    try {
      const snap = Array.from(this.panes.values()).map(p => ({ id: p.id, collapsed: p.collapsed, fullscreen: p.fullscreen }));
      sessionStorage.setItem('layout.state', JSON.stringify(snap));
    } catch (e) {
      /* ignore */
    }
  },
  setCollapsed(id, bool) {
    const rec = this.panes.get(id);
    if (!rec) return;
    rec.collapsed = bool;
    const el = rec.el;
    el.classList.toggle('is-collapsed', bool);
    el.classList.toggle('collapsed', bool);
    const body = el.querySelector('.pane-body');
    if (body) body.setAttribute('aria-hidden', bool ? 'true' : 'false');
    if (bool) {
      this.lastCollapsed.push(id);
      const restore = document.getElementById('btnRestorePane');
      restore?.removeAttribute('disabled');
      const hint = document.createElement('div');
      hint.textContent = 'Pane collapsed';
      hint.className = 'restore-hint';
      hint.setAttribute('aria-live', 'polite');
      el.appendChild(hint);
      setTimeout(() => hint.remove(), 2000);
    } else {
      const idx = this.lastCollapsed.indexOf(id);
      if (idx >= 0) this.lastCollapsed.splice(idx, 1);
      if (this.lastCollapsed.length === 0) document.getElementById('btnRestorePane')?.setAttribute('disabled', '');
    }
    this._saveState();
  },
  setFullscreen(id, bool) {
    const rec = this.panes.get(id);
    if (!rec) return;
    const el = rec.el;
    rec.fullscreen = bool;
    if (bool) {
      this.activeFullscreen = id;
      el.classList.add('is-fullscreen');
      document.body.classList.add('app-has-fullscreen');
      const btn = document.createElement('button');
      btn.className = 'btn-exit-fullscreen';
      btn.textContent = 'Exit';
      btn.setAttribute('aria-label', 'Exit Fullscreen');
      btn.addEventListener('click', () => this.setFullscreen(id, false));
      el.appendChild(btn);
      el.requestFullscreen?.();
    } else {
      if (this.activeFullscreen === id) this.activeFullscreen = null;
      el.classList.remove('is-fullscreen');
      document.body.classList.remove('app-has-fullscreen');
      el.querySelector('.btn-exit-fullscreen')?.remove();
      if (document.fullscreenElement === el) document.exitFullscreen?.();
    }
    this._saveState();
  },
  restoreLastCollapsed() {
    const id = this.lastCollapsed.pop();
    if (!id) return;
    this.setCollapsed(id, false);
    if (this.lastCollapsed.length === 0) document.getElementById('btnRestorePane')?.setAttribute('disabled', '');
  },
  getState() {
    return Array.from(this.panes.values()).map(p => ({ id: p.id, collapsed: p.collapsed, fullscreen: p.fullscreen }));
  },
  _injectStyles() {
    if (document.getElementById('layout-manager-styles')) return;
    const s = document.createElement('style');
    s.id = 'layout-manager-styles';
    s.textContent = `
.pane.is-fullscreen { position:fixed; inset:0; z-index:9999; background:#0b0e14; }
body.app-has-fullscreen .pane:not(.is-fullscreen) { filter:blur(2px) brightness(0.5); pointer-events:none; }
.btn-exit-fullscreen { position:absolute; top:8px; right:8px; z-index:10000; }
.pane.is-collapsed .pane-body { height:0; overflow:hidden; }
#btnRestorePane { position:fixed; left:12px; bottom:12px; z-index:10001; }
.restore-hint { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); font-size:12px; background:#1b2330cc; padding:4px 6px; border:1px solid #2a3446; border-radius:6px; }
`;
    document.head.appendChild(s);
  }
};
export default LayoutManager;
