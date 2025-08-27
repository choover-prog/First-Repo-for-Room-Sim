import { get, getFullscreen, applyCollapseStates } from './CollapseState.js';

export function mountLayout({ root }) {
  function panel(tag, id, zone, title, collapseLabel) {
    const el = document.createElement(tag);
    el.id = id;
    el.dataset.zone = zone;
    const header = document.createElement('div');
    header.className = 'region-header';
    const span = document.createElement('span');
    span.textContent = title;
    header.appendChild(span);
    if (collapseLabel) {
      const btn = document.createElement('button');
      btn.textContent = collapseLabel;
      btn.addEventListener('click', () => {
        window.dispatchEvent(
          new CustomEvent('ui:collapse:set', {
            detail: { zone, value: !get(zone) }
          })
        );
      });
      header.appendChild(btn);
    }
    const body = document.createElement('div');
    body.className = 'region-body';
    el.append(header, body);
    root.appendChild(el);
    return { el, body };
  }

  const left = panel('aside', 'panel-left', 'left', 'Navigation', '[▶]');
  const main = panel('main', 'panel-main', 'main', 'Viewer');
  const dock = panel('section', 'panel-dock', 'bottom', 'Controls', '[▾]');
  const right = panel('aside', 'panel-right', 'right', 'Equipment', '[◀]');

  const fsBtn = document.createElement('button');
  fsBtn.textContent = '[⛶]';
  fsBtn.addEventListener('click', () => {
    window.dispatchEvent(
      new CustomEvent('ui:fullscreen:set', {
        detail: { value: !getFullscreen() }
      })
    );
  });
  main.el.querySelector('.region-header').appendChild(fsBtn);

  applyCollapseStates();
  window.addEventListener('ui:change', applyCollapseStates);

  return {
    regions: {
      left: left.body,
      viewer: main.body,
      dock: dock.body,
      right: right.body
    }
  };
}
