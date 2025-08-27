const LS_KEY = 'room.state.v1';

let state = {
  room: { L: 0, W: 0, H: 0, origin: [0,0,0], up: 'Y', scale_m: 1.0 },
  objects: [],
  mlp: { pos: [0,0,0], yaw: 0 },
  meta: { pipeline: 'manual', ts: 0 }
};

const listeners = new Set();
let saveTimer = null;

function emit(type, payload){
  listeners.forEach(fn => fn({ type, payload }));
  scheduleSave();
}

function scheduleSave(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  }, 50);
}

export function init(initial){
  if (initial) {
    state = initial;
  } else {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try { state = JSON.parse(saved); } catch {}
    }
  }
  emit('room:replace', { room: getState() });
}

export function getState(){
  return JSON.parse(JSON.stringify(state));
}

export function setDims(partial){
  state.room = { ...state.room, ...partial };
  emit('room:dims', { dims: state.room });
}

export function addObject(obj){
  state.objects.push(obj);
  emit('room:object:add', { obj });
}

export function updateObject(id, patch){
  const obj = state.objects.find(o => o.id === id);
  if (!obj) return;
  Object.assign(obj, patch);
  emit('room:object:update', { id, patch });
}

export function removeObject(id){
  const idx = state.objects.findIndex(o => o.id === id);
  if (idx === -1) return;
  state.objects.splice(idx,1);
  emit('room:object:remove', { id });
}

export function setMLP(partial){
  state.mlp = { ...state.mlp, ...partial };
  emit('room:mlp', { mlp: state.mlp });
}

export function replaceAll(next){
  state = next;
  emit('room:replace', { room: getState() });
}

export function subscribe(fn){
  listeners.add(fn);
  return () => listeners.delete(fn);
}
