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
  const list = document.createElement('ul');

  root.append(modelSel, addBtn, list);
  container.appendChild(root);

  const speakers = [];

  function render() {
    list.innerHTML = '';
    speakers.forEach((s) => {
      const li = document.createElement('li');
      li.textContent = s;
      list.appendChild(li);
    });
  }

  addBtn.onclick = () => {
    const model = modelSel.value || MODELS[0];
    speakers.push(model);
    render();
  };

  render();
}
