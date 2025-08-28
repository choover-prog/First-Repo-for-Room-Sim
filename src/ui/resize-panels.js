document.addEventListener('DOMContentLoaded', () => {
  const $  = s=>document.querySelector(s);
  const app  = $('#app');
  const top  = $('#appHeader');
  const left = $('#panelLeft');
  const right= $('#panelRight');
  const bottom=$('#panelBottom');
  const view = $('#view');
  if (!app || !view) { console.warn('[resize-panels] #app or #view missing'); return; }

  // Create splitter elements (non-destructive)
  function ensureSplitter(id, cls, parent){
    let el = document.getElementById(id);
    if (!el){
      el = document.createElement('div');
      el.id = id; el.className = cls;
      parent.appendChild(el);
    }
    return el;
  }
  // Splitters are absolutely positioned in #view’s stacking context so they sit on seams
  const sLeft   = ensureSplitter('splitLeft',   'splitter-v', view);
  const sRight  = ensureSplitter('splitRight',  'splitter-v', view);
  const sTop    = ensureSplitter('splitTop',    'splitter-h', view);
  const sBottom = ensureSplitter('splitBottom', 'splitter-h', view);

  const K = { leftW:'ui.leftW', rightW:'ui.rightW', bottomH:'ui.bottomH', topH:'ui.topH', fsPanel:'ui.fsPanel' };

  function isFS(){ return !!localStorage.getItem(K.fsPanel); }

  let dragging = null; // 'left'|'right'|'top'|'bottom'
  let startX=0, startY=0, startLW=0, startRW=0, startBH=0, startTH=0;

  const onDown = (which)=>(e)=>{
    if (isFS()) return; // disable in per-panel fullscreen
    document.body.classList.add('is-dragging');
    dragging = which;
    const evt = e.touches ? e.touches[0] : e;
    startX = evt.clientX; startY = evt.clientY;
    const cs = getComputedStyle(app);
    startLW = parseFloat(cs.getPropertyValue('--left-w'))  || 280;
    startRW = parseFloat(cs.getPropertyValue('--right-w')) || 320;
    startBH = parseFloat(cs.getPropertyValue('--bottom-h'))|| 120;
    startTH = parseFloat(cs.getPropertyValue('--top-h'))   || 56;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('mouseup', onUp, {once:true});
    window.addEventListener('touchend', onUp, {once:true});
  };

  function onMove(e){
    if (!dragging) return;
    const evt = e.touches ? e.touches[0] : e;
    const dx = evt.clientX - startX;
    const dy = evt.clientY - startY;

    // clamp helpers
    const clamp = (v,min,max)=>Math.max(min, Math.min(max, v));

    if (dragging==='left'){
      const next = clamp(startLW + dx, 180, Math.min(window.innerWidth*0.5, 600));
      app.style.setProperty('--left-w', next+'px');
      localStorage.setItem(K.leftW, String(next));
    }
    if (dragging==='right'){
      const next = clamp(startRW - dx, 180, Math.min(window.innerWidth*0.5, 600));
      app.style.setProperty('--right-w', next+'px');
      localStorage.setItem(K.rightW, String(next));
    }
    if (dragging==='bottom'){
      const next = clamp(startBH - dy, 56, Math.min(window.innerHeight*0.6, 500));
      app.style.setProperty('--bottom-h', next+'px');
      localStorage.setItem(K.bottomH, String(next));
    }
    if (dragging==='top'){
      const next = clamp(startTH + dy, 44, Math.min(window.innerHeight*0.4, 220));
      app.style.setProperty('--top-h', next+'px');
      localStorage.setItem(K.topH, String(next));
    }
    e.preventDefault?.();
  }

  function onUp(){
    dragging = null;
    document.body.classList.remove('is-dragging');
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchmove', onMove);
  }

  sLeft.addEventListener('mousedown', onDown('left'));
  sRight.addEventListener('mousedown', onDown('right'));
  sBottom.addEventListener('mousedown', onDown('bottom'));
  sTop.addEventListener('mousedown', onDown('top'));
  sLeft.addEventListener('touchstart', onDown('left'), {passive:true});
  sRight.addEventListener('touchstart', onDown('right'), {passive:true});
  sBottom.addEventListener('touchstart', onDown('bottom'), {passive:true});
  sTop.addEventListener('touchstart', onDown('top'), {passive:true});

  console.info('[resize-panels] splitters ready (left/right/top/bottom).');
});
