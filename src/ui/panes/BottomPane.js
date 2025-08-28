import { makeButton, makeDropdown, mountSection, initPane } from '../controls.js';

export function mount(el) {
  if (!el) return;
  initPane('paneBottom', el, 'bottom');
  const sec = mountSection();
  const measureFile = document.createElement('input');
  measureFile.type = 'file';
  measureFile.id = 'measureFile';
  measureFile.accept = '.csv,.txt,.json,.wav';
  measureFile.hidden = true;
  measureFile.addEventListener('change', () => {
    console.info('[UI]', 'btnImportMeasurements');
    window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'btnImportMeasurements' } }));
  });
  sec.append(
    makeButton('btnChat', 'AI Coach'),
    makeButton('btnCalAssistant', 'Calibration Assistant'),
    measureFile,
    makeButton('btnImportMeasurements', 'Choose File', 'Upload Measurements'),
    makeButton('btnExportFilters', 'Export Filters'),
    makeDropdown('micLayoutSel', ['Default']),
    makeButton('btnExportMics', 'Export Mics')
  );
  el.appendChild(sec);
}
