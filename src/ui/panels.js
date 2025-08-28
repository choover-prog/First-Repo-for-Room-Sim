document.addEventListener('DOMContentLoaded', () => {
  const $  = s=>document.querySelector(s);
  const $$ = s=>[...document.querySelectorAll(s)];
  const app  = $('#app');
  const top  = $('#appHeader');
  const left = $('#panelLeft');
  const right= $('#panelRight');
  const bottom=$('#panelBottom');
  const view = $('#view');

  if (!app || !view) { console.warn('[panels] #app or #view missing'); return; }

  // Ensure headers exist and have actions (non-destructive patch)
  function ensureHdr(panel, title){
    if (!panel) return;
    let hdr = panel.querySelector('.panel__hdr');
    if (!hdr) {
      hdr = document.createElement('div');
      hdr.className = 'panel__hdr';
      hdr.innerHTML = `
        <div class="panel__title">${title}</div>
        <div class="panel__actions">
          <button class="panel__collapse" data-target="${panel.id}" title="Collapse" aria-label="Collapse">▾</button>
          <button class="panel__fs" data-target="${panel.id}" title="Fullscreen" aria-label="Fullscreen">⤢</button>
        </div>`;
      panel.prepend(hdr);
      if (!panel.querySelector('.panel__body')) {
        const body = document.createElement('div'); body.className='panel__body'; body.id=panel.id+'Body';
        panel.appendChild(body);
      }
    }
  }
  ensureHdr(top, 'Navigation');
  ensureHdr(left,'Controls');
  ensureHdr(right,'Equipment');
  ensureHdr(bottom,'Viewer Controls');

  // State keys
  const K = {
    leftW:'ui.leftW', rightW:'ui.rightW', bottomH:'ui.bottomH', topH:'ui.topH',
    leftCollapsed:'ui.leftCollapsed', rightCollapsed:'ui.rightCollapsed',
    bottomCollapsed:'ui.bottomCollapsed', topCollapsed:'ui.topCollapsed',
    fsPanel:'ui.fsPanel' // one of: 'left'|'right'|'bottom'|'top'|'view'|''
  };

  // Apply persisted sizes
  const leftW   = parseFloat(localStorage.getItem(K.leftW)   || '') || null;
  const rightW  = parseFloat(localStorage.getItem(K.rightW)  || '') || null;
  const bottomH = parseFloat(localStorage.getItem(K.bottomH) || '') || null;
  const topH    = parseFloat(localStorage.getItem(K.topH)    || '') || null;

  if (leftW)  app.style.setProperty('--left-w',  leftW  + 'px');
  if (rightW) app.style.setProperty('--right-w', rightW + 'px');
  if (bottomH)app.style.setProperty('--bottom-h',bottomH+ 'px');
  if (topH)   app.style.setProperty('--top-h',   topH   + 'px');

  // Apply collapsed flags
  const flag = (k)=>localStorage.getItem(k)==='true';
  left  && left.classList.toggle('is-collapsed',   flag(K.leftCollapsed));
  right && right.classList.toggle('is-collapsed',  flag(K.rightCollapsed));
  bottom&& bottom.classList.toggle('is-collapsed', flag(K.bottomCollapsed));
  top   && top.classList.toggle('is-collapsed',    flag(K.topCollapsed));

  // Apply per-panel fullscreen
  const fs = localStorage.getItem(K.fsPanel) || '';
  if (fs) app.classList.add('fs-' + fs);

  // Collapse/expand handlers
  document.body.addEventListener('click', (e)=>{
    const c = e.target.closest('.panel__collapse');
    if (c){
      const id = c.getAttribute('data-target');
      const el = document.getElementById(id);
      if (el){
        const key = ({panelLeft:K.leftCollapsed,panelRight:K.rightCollapsed,panelBottom:K.bottomCollapsed,appHeader:K.topCollapsed})[id];
        const next = !el.classList.contains('is-collapsed');
        el.classList.toggle('is-collapsed', next);
        if (key) localStorage.setItem(key, String(next));
      }
    }
    const f = e.target.closest('.panel__fs');
    if (f){
      const id = f.getAttribute('data-target');
      const map = { panelLeft:'left', panelRight:'right', panelBottom:'bottom', appHeader:'top', view:'view' };
      const tag = map[id] || '';
      ['fs-left','fs-right','fs-bottom','fs-top','fs-view'].forEach(cl=>app.classList.remove(cl));
      if (tag){
        if (localStorage.getItem(K.fsPanel) === tag) {
          localStorage.setItem(K.fsPanel,'');
        } else {
          app.classList.add('fs-'+tag);
          localStorage.setItem(K.fsPanel, tag);
        }
      } else {
        localStorage.setItem(K.fsPanel,'');
      }
    }
  });

  console.info('[panels] universal panel controls ready');
});
