const PREFIX = 'ui.';
const collapseKey = zone => `${PREFIX}collapse.${zone}`;
const fullKey = `${PREFIX}fullscreen`;
export function isCollapsed(zone){
  return localStorage.getItem(collapseKey(zone)) === '1';
}
export function setCollapsed(zone,val){
  localStorage.setItem(collapseKey(zone), val ? '1':'0');
}
export function isFullscreen(){
  return localStorage.getItem(fullKey) === '1';
}
export function setFullscreen(val){
  localStorage.setItem(fullKey, val ? '1':'0');
}
export default {
  isCollapsed,
  setCollapsed,
  isFullscreen,
  setFullscreen
};
