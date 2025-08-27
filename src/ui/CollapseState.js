import { getCollapse, setCollapse, getFullscreen, setFullscreen } from '../state/ui.js';

const zones = {
  left: () => document.getElementById('panel-left'),
  right: () => document.getElementById('panel-right'),
  bottom: () => document.getElementById('panel-dock')
};

const handles = {
  left: () => document.getElementById('expand-left'),
  right: () => document.getElementById('expand-right'),
  bottom: () => document.getElementById('expand-bottom')
};

export function applyCollapseStates(){
  Object.entries(zones).forEach(([z,getEl]) => {
    const el = getEl();
    if (el) el.classList.toggle('is-collapsed', getCollapse(z));
  });
  const full = getFullscreen();
  const app = document.getElementById('app');
  if (app) app.classList.toggle('fullscreen', full);
  Object.entries(handles).forEach(([z, getHandle]) => {
    const h = getHandle();
    if (h) h.style.display = (!full && getCollapse(z)) ? 'block' : 'none';
  });
}

export function toggle(zone){
  setCollapse(zone, !getCollapse(zone));
}
export function set(zone, val){
  setCollapse(zone, val);
}
export function get(zone){
  return getCollapse(zone);
}

export function toggleFullscreen(){
  setFullscreen(!getFullscreen());
}
export function getFullscreenState(){
  return getFullscreen();
}

window.addEventListener('ui:change', applyCollapseStates);
