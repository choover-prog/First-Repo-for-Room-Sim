import { makeToggle, mountSection, initPane, makeButton } from '../controls.js';

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
  const content = initPane(el, 'left');
  const sec = mountSection();
  sec.append(
    makeToggle('tglLFHeatmap', 'LF Heatmap'),
    number('roomL'),
    number('roomW'),
    number('roomH'),
    makeToggle('tglMicLayout', 'Mic Layout'),
    makeToggle('tglSeatMarker', 'Seat Marker'),
    makeButton('btnAddSpeaker', 'Add Speaker'),
    makeButton('btnAddListener', 'Add Listener'),
    makeButton('btnSetMLP', 'Mark MLP')
  );
  content.appendChild(sec);
}
