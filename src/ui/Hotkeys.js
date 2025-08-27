import { toggle, toggleFullscreen } from './CollapseState.js';

export function initHotkeys(){
  window.addEventListener('keydown', e => {
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    if (e.key === '[') toggle('left');
    if (e.key === ']') toggle('right');
  });
}
