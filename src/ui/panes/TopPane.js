import { makeButton, mountSection, initPane } from '../controls.js';

export function mount(el) {
  if (!el) return;
  initPane('paneTop', el, 'top');
  const proj = mountSection('Project');
  proj.classList.add('project-group');
  const roomFile = document.createElement('input');
  roomFile.type = 'file';
  roomFile.id = 'roomFile';
  roomFile.accept = '.glb,.gltf,.json';
  roomFile.hidden = true;
  proj.append(
    roomFile,
    makeButton('btnImportRoom', 'Import', 'Import Room'),
    makeButton('btnLoadSample', 'Load Sample', 'Load Sample Project')
  );
  el.appendChild(proj);

  const sec = mountSection();
  sec.append(
    makeButton('btnFullscreenToggle', 'Fullscreen', 'Toggle Fullscreen'),
    makeButton('btnExportPNG', 'Export PNG'),
    makeButton('btnExportJSON', 'Export JSON'),
    makeButton('btnExportPDF', 'Export PDF'),
    makeButton('btnRestartOnboarding', 'Restart Onboarding'),
    makeButton('btnGuide', 'Guide')
  );
  el.appendChild(sec);
}
