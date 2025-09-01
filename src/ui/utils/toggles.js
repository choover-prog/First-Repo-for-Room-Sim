export function makeToggle({ id, label, checked = false, onChange = () => {} }) {
  const wrap = document.createElement('label');
  wrap.className = 'ui-toggle';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id;
  input.checked = checked;
  const span = document.createElement('span');
  span.textContent = label;
  input.addEventListener('change', (e) => onChange(e.target.checked));
  wrap.append(input, span);
  return wrap;
}
