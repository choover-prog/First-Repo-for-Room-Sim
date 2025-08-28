document.addEventListener('DOMContentLoaded', () => {
  const $ = (s)=>document.querySelector(s);

  // Require existing viewer region; if missing, warn & bail (DO NOT rebuild viewer).
  const view = $('#view');
  if (!view) { console.warn('[layout] #view not found; skipping layout enhancement.'); return; }

  // Ensure #app root exists or make a lightweight wrapper without reparenting existing canvas.
  let app = $('#app');
  if (!app) {
    app = document.createElement('div');
    app.id = 'app';
    // Wrap current body children safely:
    // Insert at body start and move only NON-viewer siblings into it carefully
    document.body.prepend(app);
    // Move everything except #view into #app, but never move canvas or change #view parent.
    [...document.body.children].forEach(el=>{
      if (el === app || el === view) return;
      app.appendChild(el);
    });
    app.appendChild(view); // if not already inside app, append (this preserves canvas if already a child)
  }

  // Header
  let header = $('#appHeader');
  if (!header) {
    header = document.createElement('header');
    header.id = 'appHeader';
    header.innerHTML = `
      <div class="hdr__title">Navigation</div>
      <button id="btnFullscreen" title="Fullscreen" aria-label="Fullscreen"></button>
    `;
    app.prepend(header);
  }

  // Left panel
  let left = $('#panelLeft');
  if (!left) {
    left = document.createElement('aside');
    left.id = 'panelLeft';
    left.innerHTML = `
      <div class="panel__hdr">
        <div class="panel__title">Controls</div>
        <button class="panel__toggle" data-target="panelLeft" aria-label="Collapse/Expand"></button>
      </div>
      <div class="panel__body" id="panelLeftBody"></div>
    `;
    // Insert before #view to satisfy grid flow
    app.insertBefore(left, view);
  }

  // Right panel
  let right = $('#panelRight');
  if (!right) {
    right = document.createElement('aside');
    right.id = 'panelRight';
    right.innerHTML = `
      <div class="panel__hdr">
        <div class="panel__title">Equipment</div>
        <button class="panel__toggle" data-target="panelRight" aria-label="Collapse/Expand"></button>
      </div>
      <div class="panel__body" id="panelRightBody"></div>
    `;
    // Insert after #view
    if (view.nextSibling) view.parentNode.insertBefore(right, view.nextSibling);
    else view.parentNode.appendChild(right);
  }

  // Move existing #ui (if any) into left panel body
  const oldUI = $('#ui');
  const leftBody = $('#panelLeftBody');
  if (oldUI && leftBody && !leftBody.contains(oldUI)) {
    leftBody.appendChild(oldUI);
  }

  // State
  const KEY_L='ui.leftCollapsed', KEY_R='ui.rightCollapsed', KEY_F='ui.fullscreen';
  const state = {
    leftCollapsed: localStorage.getItem(KEY_L) === 'true',
    rightCollapsed: localStorage.getItem(KEY_R) === 'true',
    fullscreen: localStorage.getItem(KEY_F) === 'true',
  };
  const apply = ()=>{
    left.classList.toggle('is-collapsed', state.leftCollapsed);
    right.classList.toggle('is-collapsed', state.rightCollapsed);
    app.classList.toggle('is-fullscreen', state.fullscreen);
  };
  const save = ()=> {
    localStorage.setItem(KEY_L, String(state.leftCollapsed));
    localStorage.setItem(KEY_R, String(state.rightCollapsed));
    localStorage.setItem(KEY_F, String(state.fullscreen));
  };
  apply();

  // Toggle handlers (no other wiring)
  app.addEventListener('click', (e)=>{
    const btn = e.target.closest('.panel__toggle');
    if (btn) {
      const id = btn.getAttribute('data-target');
      if (id === 'panelLeft')  { state.leftCollapsed = !state.leftCollapsed;  }
      if (id === 'panelRight') { state.rightCollapsed = !state.rightCollapsed; }
      apply(); save();
    }
  });
  const btnFS = document.getElementById('btnFullscreen');
  btnFS && btnFS.addEventListener('click', ()=>{ state.fullscreen = !state.fullscreen; apply(); save(); });

  // DO NOT resize or replace canvas here; viewer code already handles it.
  console.info('[layout] enhancement applied (non-destructive).');
});
