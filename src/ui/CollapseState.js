import { getCollapse, setCollapse, getFullscreen, setFullscreen } from '../state/ui.js';

const zones = ['left', 'right', 'bottom'];

function panelId(zone){
  if(zone === 'bottom') return 'panel-dock';
  if(zone === 'left') return 'panel-left';
  if(zone === 'right') return 'panel-right';
  return '';
}

export function applyCollapseStates(){
  zones.forEach(z => {
    const el = document.getElementById(panelId(z));
    if(el) el.classList.toggle('is-collapsed', getCollapse(z));
  });
  const app = document.getElementById('app');
  if(app) app.classList.toggle('fullscreen', getFullscreen());
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

export function setFullscreenState(val){
  setFullscreen(val);
}

export function getFullscreenState(){
  return getFullscreen();
}

window.addEventListener('ui:change', applyCollapseStates);
