import { makeToggle, mountSection, initPane } from '../controls.js';

function number(id) {
  const n = document.createElement('input');
  n.type = 'number';
  n.id = id;
  n.addEventListener('change', () => {
    console.info('[UI]', id, n.value);
    window.dispatchEvent(new CustomEvent('ui:action', { detail: { id, payload: n.value } }));
  });
  return n;
}

export function mount(el) {
  if (!el) return;
  initPane('paneLeft', el, 'left');
  const sec = mountSection();
  sec.append(
    makeToggle('tglLFHeatmap', 'LF Heatmap'),
    number('roomL'),
    number('roomW'),
    number('roomH'),
    makeToggle('tglReflections', 'Reflections'),
    makeToggle('tglMicLayout', 'Mic Layout'),
    makeToggle('tglSeatMarker', 'Seat Marker')
  );
  el.appendChild(sec);
}
