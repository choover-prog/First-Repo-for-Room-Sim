import { applyCollapseStates, toggle, toggleFullscreen } from './CollapseState.js';

export function mountLayout({ root }) {
  const app = root;

  const left = makePanel('aside', 'panel-left', 'nav', '[▶]', () => handleCollapse('left'));
  const main = makePanel('main', 'panel-main', 'viewer', '', null);
  const dock = makePanel('section', 'panel-dock', 'controls', '[▾]', () => handleCollapse('bottom'));
  const right = makePanel('aside', 'panel-right', 'shop', '[◀]', () => handleCollapse('right'));

  const fullBtn = document.createElement('button');
  fullBtn.textContent = '[⛶]';
  fullBtn.addEventListener('click', () => {
    toggleFullscreen();
    const val = document.getElementById('app').classList.contains('fullscreen');
    window.dispatchEvent(new CustomEvent('ui:fullscreen:set', { detail: { value: val } }));
  });
  main.header.appendChild(fullBtn);

  const expandLeft = document.createElement('button');
  expandLeft.id = 'expand-left';
  expandLeft.className = 'expand-handle';
  expandLeft.textContent = '[◀]';
  expandLeft.addEventListener('click', () => handleCollapse('left'));

  const expandRight = document.createElement('button');
  expandRight.id = 'expand-right';
  expandRight.className = 'expand-handle';
  expandRight.textContent = '[▶]';
  expandRight.addEventListener('click', () => handleCollapse('right'));

  const expandBottom = document.createElement('button');
  expandBottom.id = 'expand-bottom';
  expandBottom.className = 'expand-handle';
  expandBottom.textContent = '[▴]';
  expandBottom.addEventListener('click', () => handleCollapse('bottom'));

  app.append(left.zone, main.zone, dock.zone, right.zone, expandLeft, expandRight, expandBottom);

  applyCollapseStates();

  return {
    left: left.body,
    main: main.body,
    dock: dock.body,
    right: right.body
  };

  function handleCollapse(zone){
    toggle(zone);
    const val = zone === 'bottom'
      ? document.getElementById('panel-dock').classList.contains('is-collapsed')
      : zone === 'left'
        ? document.getElementById('panel-left').classList.contains('is-collapsed')
        : document.getElementById('panel-right').classList.contains('is-collapsed');
    window.dispatchEvent(new CustomEvent('ui:collapse:set', { detail: { zone, value: val } }));
  }
}

function makePanel(tag, id, zone, btnLabel, onCollapse){
  const el = document.createElement(tag);
  el.id = id;
  el.dataset.zone = zone;
  el.style.display = 'flex';
  el.style.flexDirection = 'column';

  const header = document.createElement('div');
  header.className = 'region-header';
  if (onCollapse){
    const btn = document.createElement('button');
    btn.textContent = btnLabel;
    btn.addEventListener('click', onCollapse);
    header.appendChild(btn);
  }
  const body = document.createElement('div');
  body.style.flex = '1';
  body.style.overflow = id === 'panel-main' ? 'hidden' : 'auto';
  el.appendChild(header);
  el.appendChild(body);
  return { zone: el, header, body };
}
