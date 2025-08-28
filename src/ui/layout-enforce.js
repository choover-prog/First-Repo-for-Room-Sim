document.addEventListener('DOMContentLoaded', () => {
  const $  = (s)=>document.querySelector(s);
  const $$ = (s)=>[...document.querySelectorAll(s)];

  // Require #view (the viewer). If missing, bail (don’t rebuild viewer).
  const view = $('#view');
  if (!view) { console.warn('[layout] #view missing; aborting non-destructive layout.'); return; }

  // Ensure #app root exists and contains #view (non-destructive)
  let app = $('#app');
  if (!app) {
    app = document.createElement('div'); app.id='app';
    // Place at body start and then move existing nodes into it, preserving #view parentage
    document.body.prepend(app);
  }
  if (view.parentElement !== app) app.appendChild(view);

  // Helper to ensure a panel exists with hdr/title/toggle/body
  function ensurePanel(id, title) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement(id === 'appHeader' ? 'header' : (id === 'panelBottom' ? 'section' : 'aside'));
      el.id = id;
      if (id === 'appHeader') {
        el.innerHTML = `<div class="panel__title">${title}</div><button id="btnFullscreen" class="icon-btn" title="Fullscreen" aria-label="Fullscreen">⤢</button>`;
        app.prepend(el);
      } else {
        el.innerHTML = `
          <div class="panel__hdr">
            <div class="panel__title">${title}</div>
            <button class="panel__toggle" data-target="${id}" aria-label="Collapse/Expand"></button>
          </div>
          <div class="panel__body" id="${id}Body"><div class="region__placeholder">${title}</div></div>`;
        // Insert in correct grid order
        if (id === 'panelLeft')  app.insertBefore(el, view);
        else if (id === 'panelRight') app.appendChild(el);
        else if (id === 'panelBottom') app.appendChild(el);
      }
    } else {
      // If structure exists but missing chrome, patch minimal chrome
      if (id !== 'appHeader' && !el.querySelector('.panel__hdr')) {
        el.insertAdjacentHTML('afterbegin',
          `<div class="panel__hdr">
             <div class="panel__title">${title}</div>
             <button class="panel__toggle" data-target="${id}" aria-label="Collapse/Expand"></button>
           </div>`);
      }
      if (id !== 'appHeader' && !document.getElementById(id+'Body')) {
        const body = document.createElement('div'); body.className='panel__body'; body.id=id+'Body';
        el.appendChild(body);
      }
      if (id === 'appHeader' && !document.getElementById('btnFullscreen')) {
        const fs = document.createElement('button'); fs.id='btnFullscreen'; fs.className='icon-btn'; fs.title='Fullscreen'; fs.ariaLabel='Fullscreen'; fs.textContent='⤢';
        el.appendChild(fs);
      }
    }
    return el;
  }

  // Ensure all regions
  const header = ensurePanel('appHeader','Navigation');
  const left   = ensurePanel('panelLeft','Controls');
  const right  = ensurePanel('panelRight','Equipment');
  const bottom = ensurePanel('panelBottom','Tools & Controls');

  // If previous runs put “Controls” content in the right panel, move those nodes to left body.
  function moveChildrenIfLabeled(srcBody, dstBody, keywords) {
    if (!srcBody || !dstBody) return;
    const nodes = [...srcBody.children];
    nodes.forEach(n=>{
      const text = (n.textContent||'').toLowerCase();
      if (keywords.some(k=>text.includes(k))) dstBody.appendChild(n);
    });
  }
  const leftBody   = document.getElementById('panelLeftBody');
  const rightBody  = document.getElementById('panelRightBody');
  const bottomBody = document.getElementById('panelBottomBody');

  // Heuristic re-homing:
  // Anything with “controls”, “mlp”, “measure”, “snap”, “camera” -> LEFT
  moveChildrenIfLabeled(rightBody, leftBody, ['controls','mlp','measure','snap','camera']);
  // Move primary UI container to bottom bar if present
  const ui = document.getElementById('ui');
  if (ui && bottomBody && ui.parentElement !== bottomBody) bottomBody.appendChild(ui);
  // Relocate equipment panel from UI container to right bar
  if (ui && rightBody) {
    const eqHeader = [...ui.querySelectorAll('h2')].find(h=>/equipment/i.test(h.textContent));
    if (eqHeader) rightBody.appendChild(eqHeader.parentElement);
  }
  // If there is an existing viewer toolbar (by role or class), move to bottom
  const toolbar = document.querySelector('[data-role="viewer-toolbar"], .viewer-toolbar, #viewerToolbar');
  if (toolbar && bottomBody) bottomBody.appendChild(toolbar);

  // State persistence (left/bottom/right collapse + fullscreen)
  const KEY_L='ui.leftCollapsed', KEY_B='ui.bottomCollapsed', KEY_R='ui.rightCollapsed', KEY_F='ui.fullscreen';
  const KEY_LW='ui.leftWidth', KEY_RW='ui.rightWidth';
  const state = {
    leftCollapsed:   localStorage.getItem(KEY_L) === 'true',
    bottomCollapsed: localStorage.getItem(KEY_B) === 'true',
    rightCollapsed:  localStorage.getItem(KEY_R) === 'true',
    fullscreen:      localStorage.getItem(KEY_F) === 'true',
  };
  const storedLW = parseInt(localStorage.getItem(KEY_LW),10);
  const storedRW = parseInt(localStorage.getItem(KEY_RW),10);
  if (!isNaN(storedLW)) app.style.setProperty('--left-width', storedLW + 'px');
  if (!isNaN(storedRW)) app.style.setProperty('--right-width', storedRW + 'px');
  const apply = ()=>{
    left.classList.toggle('is-collapsed',   state.leftCollapsed);
    bottom.classList.toggle('is-collapsed', state.bottomCollapsed);
    right.classList.toggle('is-collapsed',  state.rightCollapsed);
    app.classList.toggle('is-fullscreen',   state.fullscreen);
  };
  const save = ()=>{
    localStorage.setItem(KEY_L, String(state.leftCollapsed));
    localStorage.setItem(KEY_B, String(state.bottomCollapsed));
    localStorage.setItem(KEY_R, String(state.rightCollapsed));
    localStorage.setItem(KEY_F, String(state.fullscreen));
  };
  apply();

  // Toggle handlers (no other wiring)
  app.addEventListener('click', (e)=>{
    const t = e.target.closest('.panel__toggle');
    if (!t) return;
    const id = t.getAttribute('data-target');
    if (!id) return;
    const m = { panelLeft:'leftCollapsed', panelBottom:'bottomCollapsed', panelRight:'rightCollapsed' }[id];
    if (m) { state[m] = !state[m]; apply(); save(); }
  });
  const btnFS = document.getElementById('btnFullscreen');
  btnFS && btnFS.addEventListener('click', ()=>{ state.fullscreen = !state.fullscreen; apply(); save(); });

  // Resizable panels
  function makeResizable(panel, side) {
    const res = panel.querySelector('.panel__resizer') || document.createElement('div');
    res.className = 'panel__resizer';
    if (!res.parentElement) panel.appendChild(res);
    let startX,startW;
    const onMove = (e)=>{
      const dx = e.clientX - startX;
      let w = side==='left'?startW+dx:startW-dx;
      w = Math.max(150,w);
      app.style.setProperty(side==='left'?'--left-width':'--right-width', w+'px');
    };
    const onUp = ()=>{
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      const val = parseInt(getComputedStyle(app).getPropertyValue(side==='left'?'--left-width':'--right-width'),10);
      localStorage.setItem(side==='left'?KEY_LW:KEY_RW, String(val));
    };
    res.addEventListener('mousedown',(e)=>{
      e.preventDefault();
      startX = e.clientX;
      const rect = panel.getBoundingClientRect();
      startW = rect.width;
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });
  }
  makeResizable(left,'left');
  makeResizable(right,'right');

  console.info('[layout] 5-region layout enforced non-destructively.');
});

