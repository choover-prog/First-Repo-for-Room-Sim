// Minimal layout state management for panels and fullscreen

document.addEventListener('DOMContentLoaded', () => {
  const qs = (s) => document.querySelector(s);
  const app = qs('#app');
  const left = qs('#panelLeft');
  const right = qs('#panelRight');
  const btnFS = qs('#btnFullscreen');
  const toggles = document.querySelectorAll('.panel__toggle');
  const view = qs('#view');

  const KEY_L = 'ui.leftCollapsed';
  const KEY_R = 'ui.rightCollapsed';
  const KEY_F = 'ui.fullscreen';

  function getState() {
    return {
      leftCollapsed: localStorage.getItem(KEY_L) === 'true',
      rightCollapsed: localStorage.getItem(KEY_R) === 'true',
      fullscreen: localStorage.getItem(KEY_F) === 'true',
    };
  }

  function saveState(s) {
    localStorage.setItem(KEY_L, String(!!s.leftCollapsed));
    localStorage.setItem(KEY_R, String(!!s.rightCollapsed));
    localStorage.setItem(KEY_F, String(!!s.fullscreen));
  }

  function applyState(s) {
    if (left) {
      left.classList.toggle('is-collapsed', !!s.leftCollapsed);
      left.style.width = s.leftCollapsed ? '0' : '';
      const body = left.querySelector('.panel__body');
      if (body) body.style.display = s.leftCollapsed ? 'none' : '';
    }
    if (right) {
      right.classList.toggle('is-collapsed', !!s.rightCollapsed);
      right.style.width = s.rightCollapsed ? '0' : '';
      const body = right.querySelector('.panel__body');
      if (body) body.style.display = s.rightCollapsed ? 'none' : '';
    }
    if (app) app.classList.toggle('is-fullscreen', !!s.fullscreen);
  }

  let state = getState();
  applyState(state);

  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;
      const el = document.getElementById(targetId);
      if (!el) return;
      const key = targetId === 'panelLeft' ? 'leftCollapsed' : 'rightCollapsed';
      state[key] = !state[key];
      applyState(state);
      saveState(state);
    });
  });

  btnFS?.addEventListener('click', () => {
    state.fullscreen = !state.fullscreen;
    applyState(state);
    saveState(state);
  });

  // Keep canvas sized if present
  if (view) {
    const ro = new ResizeObserver(() => {
      const canvas = view.querySelector('canvas');
      if (canvas) {
        const { width, height } = view.getBoundingClientRect();
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
      }
    });
    ro.observe(view);
  }
});

