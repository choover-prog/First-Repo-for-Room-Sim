import { applyCollapseStates, get, set, getFullscreenState, setFullscreenState } from './CollapseState.js';

function makePanel(tag, id, zone, title, btnLabel){
  const panel = document.createElement(tag);
  panel.id = id;
  panel.dataset.zone = zone;

  const header = document.createElement('div');
  header.className = 'region-header';
  const titleSpan = document.createElement('span');
  titleSpan.textContent = title;
  header.appendChild(titleSpan);
  let btn = null;
  if(btnLabel){
    btn = document.createElement('button');
    btn.textContent = btnLabel;
    header.appendChild(btn);
  }
  const body = document.createElement('div');
  body.className = 'region-body';
  panel.append(header, body);
  return { panel, header, body, btn };
}

export function mountLayout({ root }){
  const left = makePanel('aside', 'panel-left', 'nav', 'Navigation', '▶');
  const main = makePanel('main', 'panel-main', 'viewer', 'Viewer');
  const dock = makePanel('section', 'panel-dock', 'controls', 'Controls', '▾');
  const right = makePanel('aside', 'panel-right', 'shop', 'Equipment', '◀');

  const fsBtn = document.createElement('button');
  fsBtn.textContent = '⛶';
  main.header.appendChild(fsBtn);

  root.append(left.panel, main.panel, dock.panel, right.panel);

  // expand handles for collapsed panels
  const expandLeft = document.createElement('button');
  expandLeft.id = 'expand-left';
  expandLeft.textContent = '▶';
  const expandRight = document.createElement('button');
  expandRight.id = 'expand-right';
  expandRight.textContent = '◀';
  const expandBottom = document.createElement('button');
  expandBottom.id = 'expand-bottom';
  expandBottom.textContent = '▴';
  expandLeft.className = expandRight.className = expandBottom.className = 'expand-handle';
  root.append(expandLeft, expandRight, expandBottom);

  // move existing containers if present
  const viewEl = document.getElementById('view');
  if(viewEl) main.body.appendChild(viewEl);
  const uiEl = document.getElementById('ui');
  if(uiEl) left.body.appendChild(uiEl);

  left.btn.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('ui:collapse:set', { detail: { zone:'left', value: !get('left') } }));
  });
  right.btn.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('ui:collapse:set', { detail: { zone:'right', value: !get('right') } }));
  });
  dock.btn.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('ui:collapse:set', { detail: { zone:'bottom', value: !get('bottom') } }));
  });
  fsBtn.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('ui:fullscreen:set', { detail: { value: !getFullscreenState() } }));
  });

  expandLeft.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('ui:collapse:set', { detail: { zone:'left', value:false } }));
  });
  expandRight.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('ui:collapse:set', { detail: { zone:'right', value:false } }));
  });
  expandBottom.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('ui:collapse:set', { detail: { zone:'bottom', value:false } }));
  });

  window.addEventListener('ui:collapse:set', e => {
    const { zone, value } = e.detail;
    set(zone, value);
  });
  window.addEventListener('ui:fullscreen:set', e => {
    setFullscreenState(e.detail.value);
  });

  function updateHandles(){
    const fs = getFullscreenState();
    expandLeft.style.display = get('left') && !fs ? 'block' : 'none';
    expandRight.style.display = get('right') && !fs ? 'block' : 'none';
    expandBottom.style.display = get('bottom') && !fs ? 'block' : 'none';
  }

  window.addEventListener('ui:change', updateHandles);

  applyCollapseStates();
  updateHandles();

  return {
    root,
    regions: {
      left: left.body,
      viewer: main.body,
      dock: dock.body,
      right: right.body
    }
  };
}
