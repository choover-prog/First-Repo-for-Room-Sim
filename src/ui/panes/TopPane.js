import { makeButton, makeDropdown, mountSection, initPane } from '../controls.js';
import { makeToggle } from '../utils/toggles.js';

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
      makeDropdown('testRoomSel', [
        'baseline_6x8x2.6',
        'small_4.2x5.5x2.4',
        'l_room',
        'low_ceiling_5x5x2.25'
      ]),
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
      })
    );

    const btnRestart = makeButton('btnRestartOnboarding', 'Restart Onboarding');
    const btnGuide = makeButton('btnGuide', 'Guide');
    const btnReset = makeButton('btnResetLayout', 'Reset Layout', 'Reset all panes');
    btnReset.dataset.cmd = 'reset-layout';
    const btnRestore = makeButton('btnRestoreLayout', 'Restore', 'Restore panes');
    btnRestore.dataset.cmd = 'restore-layout';

    sec.append(btnRestart, btnGuide, btnReset, btnRestore);

    content.appendChild(sec);
}
