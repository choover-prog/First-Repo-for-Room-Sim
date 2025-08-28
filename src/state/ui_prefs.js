const PREFIX = 'app.ui.';

export function getPaneState() {
  const json = localStorage.getItem(PREFIX + 'panes') || '{}';
  return JSON.parse(json);
}

export function setPaneState(next) {
  localStorage.setItem(PREFIX + 'panes', JSON.stringify(next));
}

export function getTooltipsEnabled() {
  const v = localStorage.getItem(PREFIX + 'tooltips');
  return v === null ? true : JSON.parse(v);
}

export function setTooltipsEnabled(val) {
  localStorage.setItem(PREFIX + 'tooltips', JSON.stringify(!!val));
}
