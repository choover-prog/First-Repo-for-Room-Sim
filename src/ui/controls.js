import { getPaneState, setPaneState } from '../state/ui_prefs.js';

export function makeButton(id, label, title) {
  const b = document.createElement('button');
  b.id = id;
  b.textContent = label;
  b.title = title || label;
  b.setAttribute('aria-label', title || label);
  b.addEventListener('click', () => {
    console.info('[UI]', id);
    window.dispatchEvent(new CustomEvent('ui:action', { detail: { id } }));
  });
  return b;
}

export function makeToggle(id, label) {
  const l = document.createElement('label');
  const i = document.createElement('input');
  i.type = 'checkbox';
  i.id = id;
  i.addEventListener('change', () => {
    console.info('[UI]', id, i.checked);
    window.dispatchEvent(new CustomEvent('ui:action', { detail: { id, payload: i.checked } }));
  });
  l.append(i, document.createTextNode(' ' + label));
  return l;
}

export function makeDropdown(id, opts) {
  const sel = document.createElement('select');
  sel.id = id;
  opts.forEach(o => {
    const opt = document.createElement('option');
    if (typeof o === 'string') { opt.value = o; opt.textContent = o; }
    else { opt.value = o.value; opt.textContent = o.label; }
    sel.appendChild(opt);
  });
  sel.addEventListener('change', () => {
    console.info('[UI]', id, sel.value);
    window.dispatchEvent(new CustomEvent('ui:action', { detail: { id, payload: sel.value } }));
  });
  return sel;
}

export function mountSection(title) {
  const div = document.createElement('div');
  if (title) {
    const h = document.createElement('h3');
    h.textContent = title;
    div.appendChild(h);
  }
  return div;
}

export function initPane(el, side) {
  const label = side.charAt(0).toUpperCase() + side.slice(1);
  el.dataset.paneId = side;

  const content = document.createElement('div');
  content.className = 'content pane-body';
  el.appendChild(content);

  const toggle = document.createElement('button');
  toggle.id = `btnCollapse${label}`;
  toggle.className = 'collapse-toggle btn-collapse';
  toggle.textContent = '▾';
  toggle.title = 'Collapse';
  toggle.setAttribute('aria-label', 'Collapse');
  el.appendChild(toggle);

  const fs = document.createElement('button');
  fs.className = 'btn-fullscreen';
  fs.textContent = '⛶';
  fs.setAttribute('aria-label', 'Fullscreen');
  el.appendChild(fs);

  const rail = document.createElement('div');
  rail.className = 'rail-label';
  rail.textContent = label;
  el.appendChild(rail);

  const handle = document.createElement('div');
  handle.className = 'handle';
  el.appendChild(handle);

  handle.addEventListener('mousedown', e => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = el.offsetWidth;
    const startH = el.offsetHeight;
    function onMove(ev) {
      if (side === 'left') {
        const w = startW + (ev.clientX - startX);
        el.style.width = w + 'px';
      } else if (side === 'right') {
        const w = startW - (ev.clientX - startX);
        el.style.width = w + 'px';
      } else if (side === 'bottom') {
        const h = startH - (ev.clientY - startY);
        el.style.height = h + 'px';
      } else if (side === 'top') {
        const h = startH + (ev.clientY - startY);
        el.style.height = h + 'px';
      }
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      saveSize();
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  });

  function saveSize() {
    const state = getPaneState();
    const size = side === 'left' || side === 'right' ? el.offsetWidth : el.offsetHeight;
    state[side] = { ...(state[side] || {}), size };
    setPaneState(state);
  }

  return content;
}
