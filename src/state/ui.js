const PREFIX = 'ui.';
const collapseKey = zone => `${PREFIX}collapse.${zone}`;
const fullKey = `${PREFIX}fullscreen`;

function dispatch(key, value){
  window.dispatchEvent(new CustomEvent('ui:change',{detail:{key,value}}));
}

export function getCollapse(zone){
  return localStorage.getItem(collapseKey(zone)) === '1';
}
export function setCollapse(zone,val){
  localStorage.setItem(collapseKey(zone), val ? '1':'0');
  dispatch(`collapse.${zone}`, val);
}

export function getFullscreen(){
  return localStorage.getItem(fullKey) === '1';
}
export function setFullscreen(val){
  localStorage.setItem(fullKey, val ? '1':'0');
  dispatch('fullscreen', val);
}

export default {
  getCollapse,
  setCollapse,
  getFullscreen,
  setFullscreen
};
