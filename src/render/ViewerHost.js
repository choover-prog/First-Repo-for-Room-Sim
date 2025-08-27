export function mountViewerHost(root){
  const view = document.createElement('div');
  view.id = 'view';
  view.style.position = 'relative';
  view.style.width = '100%';
  view.style.height = '100%';
  const label = document.createElement('div');
  label.id = 'measureLabel';
  label.className = 'measure-label';
  label.style.display = 'none';
  view.appendChild(label);
  root.appendChild(view);
  return view;
}
