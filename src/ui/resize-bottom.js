document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const app = $('#app');
  const view = $('#view');
  const bottom = $('#panelBottom');
  if (!app || !view || !bottom) { console.warn('[resize-bottom] required nodes missing; skipping.'); return; }

  // Create an overlay host that owns the ::after seam (non-destructive)
  let seamHost = document.getElementById('splitterBottomHost');
  if (!seamHost) {
    seamHost = document.createElement('div');
    seamHost.id = 'splitterBottomHost';
    seamHost.className = 'splitter--bottom';
    app.appendChild(seamHost);
  }

  const KEY_H = 'ui.bottomH';
  const KEY_BC = 'ui.bottomCollapsed';
  const KEY_FS = 'ui.fullscreen';

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function getBottomH() {
    const saved = parseFloat(localStorage.getItem(KEY_H));
    return Number.isFinite(saved) ? saved : 120;
  }
  function setBottomH(px) {
    app.style.setProperty('--bottom-h', `${px}px`);
    localStorage.setItem(KEY_H, String(px));
  }

  // Initialize height if not fullscreen/collapsed
  const initCollapsed = localStorage.getItem(KEY_BC) === 'true';
  const initFS = localStorage.getItem(KEY_FS) === 'true';
  if (!initCollapsed && !initFS) {
    setBottomH(getBottomH());
  }

  let dragging = false;
  let startY = 0;
  let startH = 0;

  function onDown(e) {
    const collapsed = bottom.classList.contains('is-collapsed') || localStorage.getItem(KEY_BC) === 'true';
    const fs = app.classList.contains('is-fullscreen') || localStorage.getItem(KEY_FS) === 'true';
    if (collapsed || fs) return;

    dragging = true;
    startY = (e.touches ? e.touches[0].clientY : e.clientY);
    startH = getBottomH();
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('mouseup', onUp, {once:true});
    window.addEventListener('touchend', onUp, {once:true});
  }

  function onMove(e) {
    if (!dragging) return;
    const y = (e.touches ? e.touches[0].clientY : e.clientY);
    const dy = startY - y;
    const next = clamp(startH + dy, 56, Math.min(window.innerHeight * 0.6, 400));
    setBottomH(next);
    e.preventDefault?.();
  }

  function onUp() {
    dragging = false;
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchmove', onMove);
  }

  // Attach pointer handlers to a real element placed at the seam
  let grab = document.getElementById('bottomGrabber');
  if (!grab) {
    grab = document.createElement('div');
    grab.id = 'bottomGrabber';
    grab.style.position = 'absolute';
    grab.style.left = 0; grab.style.right = 0;
    grab.style.height = '6px';
    grab.style.cursor = 'ns-resize';
    grab.style.zIndex = 6;
    seamHost.appendChild(grab);
  }

  function syncGrabber() {
    const h = getBottomH();
    grab.style.bottom = `${h}px`;
  }

  const ro = new ResizeObserver(syncGrabber);
  ro.observe(app);
  window.addEventListener('resize', syncGrabber);
  syncGrabber();

  grab.addEventListener('mousedown', onDown);
  grab.addEventListener('touchstart', onDown, {passive:true});

  const mo = new MutationObserver(() => {
    const collapsed = bottom.classList.contains('is-collapsed') || localStorage.getItem(KEY_BC) === 'true';
    const fs = app.classList.contains('is-fullscreen') || localStorage.getItem(KEY_FS) === 'true';
    if (collapsed || fs) {
      // seam hidden
    } else {
      setBottomH(getBottomH());
      syncGrabber();
    }
  });
  mo.observe(app, { attributes:true, attributeFilter:['class'] });
  mo.observe(bottom, { attributes:true, attributeFilter:['class'] });

  console.info('[resize-bottom] enabled: drag the seam between viewer and bottom panel to resize.');
});

