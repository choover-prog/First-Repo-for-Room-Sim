import { get, getFullscreenState } from './CollapseState.js';

export function bindHotkeys(){
  window.addEventListener('keydown', e => {
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('ui:fullscreen:set', { detail: { value: !getFullscreenState() } }));
    } else if (e.key === '[') {
      window.dispatchEvent(new CustomEvent('ui:collapse:set', { detail: { zone:'left', value: !get('left') } }));
    } else if (e.key === ']') {
      window.dispatchEvent(new CustomEvent('ui:collapse:set', { detail: { zone:'right', value: !get('right') } }));
    }
  });
}
