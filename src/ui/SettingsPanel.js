export function mountSettingsPanel({ rootEl }) {
  const container = document.createElement('div');
  container.id = 'settingsPanel';
  container.style.padding = '8px';
  container.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
  container.style.fontSize = '14px';

  const label = document.createElement('label');
  label.style.display = 'flex';
  label.style.alignItems = 'center';
  label.style.gap = '8px';
  label.title = 'Fixes common FBX→GLB issues (cm scale, pivot above floor, hidden ground planes). Keep ON unless diagnosing raw assets.';

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.id = 'cbNormalizeImport';

  const KEY = 'ui.normalizeImport';
  const saved = localStorage.getItem(KEY);
  const value = saved === null ? true : saved === 'true';
  cb.checked = value;

  cb.addEventListener('change', () => {
    localStorage.setItem(KEY, String(cb.checked));
  });

  const span = document.createElement('span');
  span.textContent = 'Normalize on import';

  label.appendChild(cb);
  label.appendChild(span);
  container.appendChild(label);
  rootEl?.appendChild(container);
}

export function getNormalizePref() {
  const saved = localStorage.getItem('ui.normalizeImport');
  return saved === null ? true : saved === 'true';
}
