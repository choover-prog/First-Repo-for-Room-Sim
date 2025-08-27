import { projectStore } from '../../state/projectStore';

const MODELS = ['Model A', 'Model B'];

export function mountSpeakerPanel(container: HTMLElement) {
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
  const list = document.createElement('ul');
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  const undoBtn = document.createElement('button');
  undoBtn.textContent = 'Undo';
  const redoBtn = document.createElement('button');
  redoBtn.textContent = 'Redo';

  root.append(modelSel, addBtn, list, delBtn, undoBtn, redoBtn);
  container.appendChild(root);

  addBtn.onclick = () => {
    const model = modelSel.value || MODELS[0];
    projectStore.getState().dispatch({ type: 'addSpeaker', model });
  };
  delBtn.onclick = () => {
    const { project, dispatch } = projectStore.getState();
    if (project.selectedId) dispatch({ type: 'deleteSpeaker', id: project.selectedId });
  };
  undoBtn.onclick = () => projectStore.getState().undo();
  redoBtn.onclick = () => projectStore.getState().redo();

  function render() {
    const { project, canUndo, canRedo } = projectStore.getState();
    list.innerHTML = '';
    project.speakers.forEach((s) => {
      const li = document.createElement('li');
      li.textContent = s.model;
      li.style.cursor = 'pointer';
      if (s.id === project.selectedId) li.style.fontWeight = 'bold';
      li.onclick = () => projectStore.getState().dispatch({ type: 'selectSpeaker', id: s.id });
      list.appendChild(li);
    });
    delBtn.disabled = !project.selectedId;
    undoBtn.disabled = !canUndo;
    redoBtn.disabled = !canRedo;
  }
  render();
  projectStore.subscribe(render);
}
