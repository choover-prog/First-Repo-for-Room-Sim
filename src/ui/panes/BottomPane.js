import { makeButton, mountSection, initPane } from '../controls.js';

export function mount(el) {
  if (!el) return;
  initPane('paneBottom', el, 'bottom');
  const sec = mountSection();
  const file = document.createElement('input');
  file.type = 'file';
  file.id = 'btnImportREW';
  file.addEventListener('change', () => {
    console.info('[UI]', 'btnImportREW');
    window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'btnImportREW' } }));
  });
  sec.append(
    makeButton('btnChat', 'AI Coach'),
    makeButton('btnCalAssistant', 'Calibration Assistant'),
    file,
    makeButton('btnExportFilters', 'Export Filters')
  );
  el.appendChild(sec);
}
