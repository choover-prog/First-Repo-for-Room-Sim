import {
  getCollapse as getStoredCollapse,
  setCollapse as setStoredCollapse,
  getFullscreen as getStoredFullscreen,
  setFullscreen as setStoredFullscreen
} from '../state/ui.js';

const zoneIds = { left: 'panel-left', right: 'panel-right', bottom: 'panel-dock' };

export function applyCollapseStates() {
  Object.entries(zoneIds).forEach(([zone, id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('is-collapsed', getStoredCollapse(zone));
  });
  const app = document.getElementById('app');
  if (app) app.classList.toggle('fullscreen', getStoredFullscreen());
}

export function get(zone) {
  return getStoredCollapse(zone);
}

export function set(zone, value) {
  window.dispatchEvent(
    new CustomEvent('ui:collapse:set', { detail: { zone, value } })
  );
}

export function toggle(zone) {
  set(zone, !get(zone));
}

export function getFullscreen() {
  return getStoredFullscreen();
}

export function setFullscreen(value) {
  window.dispatchEvent(
    new CustomEvent('ui:fullscreen:set', { detail: { value } })
  );
}

export function toggleFullscreen() {
  setFullscreen(!getFullscreen());
}

window.addEventListener('ui:collapse:set', (e) => {
  setStoredCollapse(e.detail.zone, e.detail.value);
});

window.addEventListener('ui:fullscreen:set', (e) => {
  setStoredFullscreen(e.detail.value);
});

window.addEventListener('ui:change', applyCollapseStates);
