const PREFIX = 'app.ui.';

function read(key) {
  const v = localStorage.getItem(PREFIX + key);
  return v ? JSON.parse(v) : null;
}

function write(key, val) {
  localStorage.setItem(PREFIX + key, JSON.stringify(val));
}

export function getPaneState(id) {
  const all = read('panes') || {};
  return all[id] || {};
}

export function setPaneState(id, state) {
  const all = read('panes') || {};
  all[id] = { ...all[id], ...state };
  write('panes', all);
}

export function getTooltipsEnabled() {
  const v = read('tooltips');
  return v === null ? true : v;
}

export function setTooltipsEnabled(val) {
  write('tooltips', !!val);
}
