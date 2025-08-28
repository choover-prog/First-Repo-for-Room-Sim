import { projectStore } from '../state/projectStore';

export function mountMLPPanel(container) {
  const root = document.createElement('div');
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add MLP';
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  const undoBtn = document.createElement('button');
  undoBtn.textContent = 'Undo';
  const redoBtn = document.createElement('button');
  redoBtn.textContent = 'Redo';
  const list = document.createElement('ul');
  root.append(addBtn, delBtn, undoBtn, redoBtn, list);
  container.appendChild(root);

  addBtn.onclick = () => {
    const { project, setMode, select } = projectStore.getState();
    if (project.mlp) select('mlp');
    else setMode('placingMLP');
  };

  delBtn.onclick = () => {
    const { project, delete: del } = projectStore.getState();
    if (project.selectedId === 'mlp') del('mlp');
  };

  undoBtn.onclick = () => projectStore.getState().undo();
  redoBtn.onclick = () => projectStore.getState().redo();

  function render() {
    const { project } = projectStore.getState();
    list.innerHTML = '';
    if (project.mlp) {
      const li = document.createElement('li');
      li.textContent = `MLP (${project.mlp.x.toFixed(2)}, ${project.mlp.z.toFixed(2)})`;
      if (project.selectedId === 'mlp') li.style.fontWeight = 'bold';
      li.onclick = () => projectStore.getState().select('mlp');
      list.appendChild(li);
    }
  }

  projectStore.subscribe(render);
  render();
}
