import { makeButton, makeDropdown, mountSection, initPane } from '../controls.js';
import { makeToggle } from '../toggles.ts';

export function mount(el) {
  if (!el) return;
  const content = initPane(el, 'top');
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
  content.appendChild(proj);

    const sec = mountSection();
    sec.append(
      makeButton('btnFullscreenToggle', 'Fullscreen', 'Toggle Fullscreen'),
      makeButton('btnExportPNG', 'Export PNG'),
      makeButton('btnExportJSON', 'Export JSON'),
      makeButton('btnExportPDF', 'Export PDF'),
      makeDropdown('roomTemplateSel', ['Default']),
      makeToggle({
        id: 'tglPlaneNormals',
        label: 'Show plane normals',
        onChange: (checked) =>
          window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'tglPlaneNormals', payload: checked } }))
      }),
      makeToggle({
        id: 'tglBouncePoints',
        label: 'Show bounce points',
        onChange: (checked) =>
          window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'tglBouncePoints', payload: checked } }))
      }),
      makeButton('btnRestartOnboarding', 'Restart Onboarding'),
      makeButton('btnGuide', 'Guide'),
      (() => {
        const btn = makeButton('btnResetLayout', 'Reset Layout', 'Reset all panes');
        btn.dataset.cmd = 'reset-layout';
        return btn;
      })(),
      (() => {
        const btn = makeButton('btnRestoreLayout', 'Restore', 'Restore panes');
        btn.dataset.cmd = 'restore-layout';
        return btn;
      })()
    );
    content.appendChild(sec);
}
