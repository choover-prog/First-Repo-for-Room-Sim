export interface OverlaysState {
  ceilingOpacity: number;
}

const state: OverlaysState = {
  ceilingOpacity: 0.8,
};

const listeners = new Set<(s: OverlaysState) => void>();

export function getOverlays(){
  return state;
}

export function setCeilingOpacity(v: number){
  state.ceilingOpacity = Math.min(1, Math.max(0.15, v));
  emit();
}

export function toggleCeilingVisibilityQuick(){
  state.ceilingOpacity = state.ceilingOpacity < 0.5 ? 0.8 : 0.3;
  emit();
}

export function subscribe(fn: (s: OverlaysState)=>void){
  listeners.add(fn); return () => listeners.delete(fn);
}

function emit(){
  listeners.forEach(fn => fn(state));
}
