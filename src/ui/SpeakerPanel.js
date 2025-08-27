import { projectStore } from '../state/projectStore.ts';

const MODELS = ['Model A', 'Model B'];

export function mountSpeakerPanel(container) {
  const root = document.createElement('div');
  const modelSel = document.createElement('select');
  MODELS.forEach((m) => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    modelSel.appendChild(opt);
  });

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Speaker';
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  const undoBtn = document.createElement('button');
  undoBtn.textContent = 'Undo';
  const redoBtn = document.createElement('button');
  redoBtn.textContent = 'Redo';
  const list = document.createElement('ul');

  root.append(modelSel, addBtn, delBtn, undoBtn, redoBtn, list);
  container.appendChild(root);

  addBtn.onclick = () => {
    window.dispatchEvent(
      new CustomEvent('ui:speaker:add', { detail: { model: modelSel.value || MODELS[0] } })
    );
  };

  delBtn.onclick = () => {
    const { project, dispatch } = projectStore.getState();
    if (project.selectedId) {
      dispatch({ type: 'deleteSpeaker', id: project.selectedId });
    }
  };

  undoBtn.onclick = () => projectStore.getState().undo();
  redoBtn.onclick = () => projectStore.getState().redo();

  function render() {
    const { project } = projectStore.getState();
    list.innerHTML = '';
    project.speakers.forEach((s) => {
      const li = document.createElement('li');
      li.textContent = s.model;
      if (s.id === project.selectedId) li.style.fontWeight = 'bold';
      li.onclick = () =>
        projectStore.getState().dispatch({ type: 'selectSpeaker', id: s.id });
      list.appendChild(li);
    });
  }

  projectStore.subscribe(render);
  render();
}

