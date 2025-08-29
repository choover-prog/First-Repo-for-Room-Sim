import { makeButton, makeDropdown, mountSection, initPane } from '../controls.js';

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
      makeButton('btnRestartOnboarding', 'Restart Onboarding'),
      makeButton('btnGuide', 'Guide'),
      makeButton('btnResetLayout', 'Reset Layout', 'Reset all panes')
    );

    const btnRef = document.createElement('button');
    btnRef.id = 'btnReflections';
    btnRef.textContent = 'Reflections';
    btnRef.title = 'First reflections (specular) — ray mirror method';
    btnRef.setAttribute('aria-label', btnRef.title);
    sec.append(btnRef);

    const btnOpts = document.createElement('button');
    btnOpts.id = 'btnReflectionsOpts';
    btnOpts.textContent = '⚙';
    btnOpts.title = 'Reflections options';
    sec.append(btnOpts);

    const pop = document.createElement('div');
    pop.id = 'reflectionsPopover';
    pop.style.position = 'absolute';
    pop.style.display = 'none';
    pop.style.background = '#0f131a';
    pop.style.color = '#e4eaf3';
    pop.style.padding = '8px';
    pop.style.fontSize = '12px';
    pop.style.zIndex = '10';
    pop.innerHTML = '<div>First-order only</div>';
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.id = 'chkRefHits';
    chk.checked = true;
    chk.addEventListener('change', e => {
      window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'reflectionsShowMarkers', payload: e.target.checked } }));
    });
    const lblChk = document.createElement('label');
    lblChk.append(chk, document.createTextNode(' Show hit markers'));
    pop.appendChild(lblChk);

    const lblClamp = document.createElement('label');
    lblClamp.textContent = 'Line length clamp ';
    const numClamp = document.createElement('input');
    numClamp.type = 'number';
    numClamp.id = 'numRefClamp';
    numClamp.value = '20';
    numClamp.min = '1';
    numClamp.step = '1';
    numClamp.addEventListener('change', e => {
      window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'reflectionsClamp', payload: e.target.value } }));
    });
    lblClamp.appendChild(numClamp);
    pop.appendChild(lblClamp);

    const lblOp = document.createElement('label');
    lblOp.textContent = 'Opacity ';
    const rng = document.createElement('input');
    rng.type = 'range';
    rng.id = 'rngRefOpacity';
    rng.min = '0.2';
    rng.max = '1';
    rng.step = '0.1';
    rng.value = '0.6';
    rng.addEventListener('input', e => {
      window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'reflectionsOpacity', payload: e.target.value } }));
    });
    lblOp.appendChild(rng);
    pop.appendChild(lblOp);

    content.appendChild(sec);
    content.appendChild(pop);

    btnOpts.addEventListener('click', () => {
      const rect = btnOpts.getBoundingClientRect();
      pop.style.left = rect.left + 'px';
      pop.style.top = rect.bottom + 'px';
      pop.style.display = pop.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', e => {
      if (e.target !== btnOpts && !pop.contains(e.target)) pop.style.display = 'none';
    });
}
