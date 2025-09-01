import { ROOM_CHANGED, getRoom } from '../state/room.slice';

let timer: number | null = null;

export function initReflectionsAgent(){
  window.addEventListener(ROOM_CHANGED, () => {
    if(timer) clearTimeout(timer);
    timer = window.setTimeout(()=>{
      // placeholder recompute
      console.info('Reflections recompute', getRoom().presetId);
      timer = null;
    },150);
  });
}
