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

  app.append(left.zone, main.zone, dock.zone, right.zone);

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

  const header = document.createElement('div');
  header.className = 'region-header';
  if (onCollapse){
    const btn = document.createElement('button');
    btn.textContent = btnLabel;
    btn.addEventListener('click', onCollapse);
    header.appendChild(btn);
  }
  const body = document.createElement('div');
  el.appendChild(header);
  el.appendChild(body);
  return { zone: el, header, body };
}
