import { toggle, toggleFullscreen } from './CollapseState.js';

export function bindHotkeys() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    } else if (e.key === '[') {
      toggle('left');
    } else if (e.key === ']') {
      toggle('right');
    }
  });
}
