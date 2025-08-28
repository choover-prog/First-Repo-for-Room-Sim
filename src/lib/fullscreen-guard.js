export function installFullscreenGuard(appEl) {
  function exitFS() {
    try { document.exitFullscreen?.(); } catch {}
    appEl?.classList.remove('is-fullscreen');
    document.body.classList.remove('is-fullscreen');
    localStorage.setItem('ui.fullscreen', 'false');
    window.dispatchEvent(new Event('resize'));
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); exitFS(); }
  }, true);

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) exitFS();
  });

  // Debug helper
  window.exitFS = exitFS;
}
