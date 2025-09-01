import create from 'zustand';

export interface CoreState {
  ready: boolean;
  setReady: (v: boolean) => void;
}

export const useCoreStore = create<CoreState>(set => ({
  ready: false,
  setReady: v => set({ ready: v })
}));
