import { getPaneState, setPaneState } from '../state/ui_prefs.js';
import { exitFullscreenSafe } from './esc_fullscreen_fix.js';

class LayoutManager {
  static instance;
  static get() {
    if (!LayoutManager.instance) LayoutManager.instance = new LayoutManager();
    return LayoutManager.instance;
  }

  constructor() {
    this.panes = new Map();
    this.state = getPaneState();
    this.lastCollapsed = null;

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (document.fullscreenElement) {
        exitFullscreenSafe();
      } else {
        this.restoreLast();
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        document.body.classList.remove('is-fullscreen');
        this.panes.forEach(p => p.el.classList.remove('fullscreen', 'dimmed'));
      } else {
        document.body.classList.add('is-fullscreen');
      }
    });
  }

  registerPane(id, el, toggleBtn) {
    if (!el) return;
    this.panes.set(id, { el });
    el.dataset.paneId = id;
    const st = this.state[id] || { open: true };
    if (st.open === false) el.classList.add('collapsed');
    if (st.size) {
      if (id === 'left' || id === 'right') el.style.width = st.size + 'px';
      else el.style.height = st.size + 'px';
    }
    if (toggleBtn) {
      toggleBtn.dataset.paneId = id;
      toggleBtn.addEventListener('click', () => this.toggleCollapse(id));
    }
    el.addEventListener('click', (e) => {
      if (!el.classList.contains('collapsed')) return;
      if (e.target === el || e.target.classList.contains('rail-label')) {
        this.toggleCollapse(id);
      }
    });
  }

  toggleCollapse(id) {
    const pane = this.panes.get(id);
    if (!pane) return;
    const collapsed = pane.el.classList.toggle('collapsed');
    this.state[id] = { ...(this.state[id] || {}), open: !collapsed };
    setPaneState(this.state);
    if (collapsed) this.lastCollapsed = id;
    if (this.restoreBtn) this.restoreBtn.disabled = !this.lastCollapsed;
  }

  restoreLast() {
    if (!this.lastCollapsed) return;
    const id = this.lastCollapsed;
    this.lastCollapsed = null;
    const pane = this.panes.get(id);
    if (pane && pane.el.classList.contains('collapsed')) {
      pane.el.classList.remove('collapsed');
      this.state[id] = { ...(this.state[id] || {}), open: true };
      setPaneState(this.state);
    }
    if (this.restoreBtn) this.restoreBtn.disabled = true;
  }

  setRestoreButton(btn) {
    if (!btn) return;
    this.restoreBtn = btn;
    btn.addEventListener('click', () => this.restoreLast());
    btn.disabled = true;
  }

  toggleFullscreen(el) {
    if (!el) return;
    if (document.fullscreenElement) {
      exitFullscreenSafe();
    } else {
      el.requestFullscreen?.();
      el.classList.add('fullscreen');
      this.panes.forEach(p => { if (p.el !== el) p.el.classList.add('dimmed'); });
    }
  }
}

export const layoutManager = LayoutManager.get();
