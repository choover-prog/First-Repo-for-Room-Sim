export function exitFullscreenSafe() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
  document.body.classList.remove('is-fullscreen');
  document.getElementById('app')?.classList.remove('is-fullscreen');
}

function showExitButton() {
  let btn = document.getElementById('btnExitFullscreen');
  if (btn) return;
  btn = document.createElement('button');
  btn.id = 'btnExitFullscreen';
  btn.textContent = 'Exit Fullscreen';
  btn.style.position = 'fixed';
  btn.style.top = '8px';
  btn.style.right = '8px';
  btn.style.zIndex = '1000';
  btn.addEventListener('click', exitFullscreenSafe);
  document.body.appendChild(btn);
}

function hideExitButton() {
  document.getElementById('btnExitFullscreen')?.remove();
}

export function installEscFullscreenFix() {
  window.exitFS = exitFullscreenSafe;
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') exitFullscreenSafe();
  });
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) showExitButton();
    else hideExitButton();
  });
}
