const PREFIX = 'ui.';
const collapseKey = (zone) => `${PREFIX}collapse.${zone}`;
const fullKey = `${PREFIX}fullscreen`;

export function getCollapse(zone) {
  return localStorage.getItem(collapseKey(zone)) === '1';
}

export function setCollapse(zone, val) {
  localStorage.setItem(collapseKey(zone), val ? '1' : '0');
  window.dispatchEvent(
    new CustomEvent('ui:change', {
      detail: { key: `collapse.${zone}`, value: val }
    })
  );
}

export function getFullscreen() {
  return localStorage.getItem(fullKey) === '1';
}

export function setFullscreen(val) {
  localStorage.setItem(fullKey, val ? '1' : '0');
  window.dispatchEvent(
    new CustomEvent('ui:change', { detail: { key: 'fullscreen', value: val } })
  );
}

export default {
  getCollapse,
  setCollapse,
  getFullscreen,
  setFullscreen
};
