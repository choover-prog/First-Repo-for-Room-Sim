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

  const GET = (name, fallback)=>{
    const v = parseFloat(getComputedStyle(app).getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  };
  const clamp = (v,min,max)=>Math.max(min, Math.min(max, v));
  const isGlobalFS = ()=> app.classList.contains('is-fullscreen');
  const activePanelFS = ()=> ['fs-left','fs-right','fs-top','fs-bottom','fs-view'].some(c=>app.classList.contains(c));

  let dragging = null; // 'left'|'right'|'top'|'bottom'
  let startX=0, startY=0, baseLeft=0, baseRight=0, baseTop=0, baseBottom=0;

  const startDrag = which => e => {
    if (isGlobalFS() || activePanelFS()) return;
    dragging = which;
    document.body.classList.add('is-dragging');
    const p = e.touches ? e.touches[0] : e;
    startX = p.clientX; startY = p.clientY;
    baseLeft   = GET('--left-w', 280);
    baseRight  = GET('--right-w', 320);
    baseTop    = GET('--top-h', 56);
    baseBottom = GET('--bottom-h', 120);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('mouseup', endDrag, {once:true});
    window.addEventListener('touchend', endDrag, {once:true});
  };

  function onMove(e){
    if (!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - startX;
    const dy = p.clientY - startY;

    const maxW = Math.min(window.innerWidth * 0.5, 600);
    const maxTop = Math.min(window.innerHeight * 0.4, 220);
    const maxBottom = Math.min(window.innerHeight * 0.6, 500);

    if (dragging==='left'){
      const next = clamp(baseLeft + dx, 180, maxW);
      app.style.setProperty('--left-w', next+'px');
      localStorage.setItem('ui.leftW', String(next));
    }
    if (dragging==='right'){
      const next = clamp(baseRight - dx, 180, maxW);
      app.style.setProperty('--right-w', next+'px');
      localStorage.setItem('ui.rightW', String(next));
    }
    if (dragging==='top'){
      const next = clamp(baseTop + dy, 44, maxTop);
      app.style.setProperty('--top-h', next+'px');
      localStorage.setItem('ui.topH', String(next));
    }
    if (dragging==='bottom'){
      const next = clamp(baseBottom - dy, 56, maxBottom);
      app.style.setProperty('--bottom-h', next+'px');
      localStorage.setItem('ui.bottomH', String(next));
    }
    e.preventDefault?.();
  }

  function endDrag(){
    dragging = null;
    document.body.classList.remove('is-dragging');
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchmove', onMove);
  }

  sLeft.addEventListener('mousedown', startDrag('left'));
  sRight.addEventListener('mousedown', startDrag('right'));
  sTop.addEventListener('mousedown', startDrag('top'));
  sBottom.addEventListener('mousedown', startDrag('bottom'));
  sLeft.addEventListener('touchstart', startDrag('left'), {passive:true});
  sRight.addEventListener('touchstart', startDrag('right'), {passive:true});
  sTop.addEventListener('touchstart', startDrag('top'), {passive:true});
  sBottom.addEventListener('touchstart', startDrag('bottom'), {passive:true});

  console.info('[resize-panels] splitters ready (left/right/top/bottom).');
});
