import { makeButton, mountSection, initPane } from '../controls.js';

export function mount(el) {
  if (!el) return;
  initPane('paneTop', el, 'top');
  const sec = mountSection();
  sec.append(
    makeButton('btnFullscreenToggle', 'Fullscreen', 'Toggle Fullscreen'),
    makeButton('btnImportRoom', 'Import', 'Import Room'),
    makeButton('btnExportPNG', 'Export PNG'),
    makeButton('btnExportJSON', 'Export JSON'),
    makeButton('btnExportPDF', 'Export PDF'),
    makeButton('btnRestartOnboarding', 'Restart Onboarding'),
    makeButton('btnGuide', 'Guide')
  );
  el.appendChild(sec);
}
