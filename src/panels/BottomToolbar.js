import { mountInto, PANE_IDS } from '../ui/panes.ts';
import { makeButton, makeDropdown } from '../ui/controls.js';

export function mountBottomToolbar() {
  const bar = document.createElement('div');
  bar.id = 'bottom-toolbar';
  bar.className = 'toolbar-row';

  const measureFile = document.createElement('input');
  measureFile.type = 'file';
  measureFile.id = 'measureFile';
  measureFile.accept = '.csv,.txt,.json,.wav';
  measureFile.hidden = true;
  measureFile.addEventListener('change', () => {
    console.info('[UI]', 'btnImportMeasurements');
    window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'btnImportMeasurements' } }));
  });

  bar.append(
    makeButton('btnChat', 'AI Coach'),
    makeButton('btnCalAssistant', 'Calibration Assistant'),
    measureFile,
    makeButton('btnImportMeasurements', 'Choose File', 'Upload Measurements'),
    makeButton('btnExportFilters', 'Export Filters'),
    makeDropdown('micLayoutSel', ['Default']),
    makeButton('btnExportMics', 'Export Mics')
  );

  mountInto(PANE_IDS.bottom, bar);
  return bar;
}
