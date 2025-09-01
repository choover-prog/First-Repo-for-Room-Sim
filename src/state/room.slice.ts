import { createStore } from 'zustand/vanilla';

export const ROOM_CHANGED = 'ROOM_CHANGED';

interface RoomState {
  presetId: string | null;
  dims: { x:number; y:number; z:number };
  setRoom: (id: string, dims: {x:number;y:number;z:number}) => void;
}

export const roomStore = createStore<RoomState>((set) => ({
  presetId: null,
  dims: { x:0, y:0, z:0 },
  setRoom: (id, dims) => {
    set({ presetId:id, dims });
    queueMicrotask(()=> window.dispatchEvent(new CustomEvent(ROOM_CHANGED, { detail:{ id, dims } })));
  }
}));

export const getRoom = () => roomStore.getState();
