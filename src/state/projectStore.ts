import type { Project, Speaker, Vec3 } from '../types/room';

// Minimal store implementation to avoid external deps (zustand)
export interface StoreApi<S> {
  getState: () => S;
  setState: (partial: S | ((state: S) => S)) => void;
  subscribe: (listener: (state: S) => void) => () => void;
}

function createStore<S>(
  initializer: (
    set: (partial: S | ((state: S) => S)) => void,
    get: () => S
  ) => S
): StoreApi<S> {
  let state: S;
  const listeners = new Set<(s: S) => void>();
  const setState = (partial: S | ((state: S) => S)) => {
    state = typeof partial === 'function' ? (partial as any)(state) : partial;
    listeners.forEach((l) => l(state));
  };
  const getState = () => state;
  state = initializer(setState, getState);
  return {
    getState,
    setState,
    subscribe(listener: (state: S) => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export type Mode = 'idle' | 'placingSpeaker' | 'placingMLP' | 'dragging';

export interface ProjectState {
  project: Project;
  mode: Mode;
  placingModel: string | null;
  undoStack: Project[];
  redoStack: Project[];
  canUndo: boolean;
  canRedo: boolean;
  setMode: (mode: Mode, data?: { model?: string }) => void;
  addSpeaker: (data: { model: string; pos: Vec3 }) => void;
  addMLP: (data: { pos: Vec3 }) => void;
  select: (id: string | null) => void;
  move: (id: string, pos: Vec3) => void;
  rotate: (id: string, deg: number) => void;
  delete: (id: string) => void;
  undo: () => void;
  redo: () => void;
}

export type Command =
  | { type: 'addSpeaker'; model: string; pos?: Vec3; rotY?: number }
  | { type: 'selectSpeaker'; id: string | null }
  | { type: 'moveSpeaker'; id: string; pos: Vec3 }
  | { type: 'deleteSpeaker'; id: string }
  | { type: 'rotateSpeaker'; id: string; deg: number }
  | { type: 'setMlp'; pos: Vec3 }
  | { type: 'deleteMlp' };

const VERSION = '1';
const DATA_KEY = 'project/current';
const VER_KEY = 'project/version';

const defaultProject: Project = { speakers: [], mlp: null, selectedId: null };

function save(project: Project) {
  try {
    const p = { ...project, selectedId: null };
    localStorage.setItem(DATA_KEY, JSON.stringify(p));
    localStorage.setItem(VER_KEY, VERSION);
  } catch {}
}

function hydrate(): Project {
  try {
    if (localStorage.getItem(VER_KEY) === VERSION) {
      const raw = localStorage.getItem(DATA_KEY);
      if (raw) {
        const proj = JSON.parse(raw) as Project;
        proj.selectedId = null;
        return proj;
      }
    }
  } catch {}
  return { ...defaultProject };
}

function reduce(project: Project, cmd: Command): Project {
  switch (cmd.type) {
    case 'addSpeaker': {
      const id = genId();
      const speaker: Speaker = {
        id,
        model: cmd.model,
        pos: cmd.pos ? { ...cmd.pos } : { x: 0, y: 0, z: 0 },
        rotY: cmd.rotY || 0,
      };
      return {
        ...project,
        speakers: [...project.speakers, speaker],
        selectedId: id,
      };
    }
    case 'selectSpeaker': {
      return { ...project, selectedId: cmd.id };
    }
    case 'moveSpeaker': {
      const speakers = project.speakers.map((s) =>
        s.id === cmd.id ? { ...s, pos: { ...cmd.pos, y: 0 } } : s
      );
      return { ...project, speakers };
    }
    case 'deleteSpeaker': {
      const speakers = project.speakers.filter((s) => s.id !== cmd.id);
      const selectedId = project.selectedId === cmd.id ? null : project.selectedId;
      return { ...project, speakers, selectedId };
    }
    case 'rotateSpeaker': {
      const speakers = project.speakers.map((s) =>
        s.id === cmd.id ? { ...s, rotY: s.rotY + (cmd.deg * Math.PI) / 180 } : s
      );
      return { ...project, speakers };
    }
    case 'setMlp': {
      return { ...project, mlp: { ...cmd.pos }, selectedId: 'mlp' };
    }
    case 'deleteMlp': {
      const selectedId = project.selectedId === 'mlp' ? null : project.selectedId;
      return { ...project, mlp: null, selectedId };
    }
    default:
      return project;
  }
}

export function createProjectStore(initial?: Project): StoreApi<ProjectState> {
  const proj = initial || hydrate();
  return createStore<ProjectState>((set, get) => {
    const apply = (cmd: Command) => {
      set((state) => {
        const prev = state.project;
        const next = reduce(prev, cmd);
        const undoStack = [...state.undoStack, prev];
        save(next);
        return {
          ...state,
          project: next,
          undoStack,
          redoStack: [],
          canUndo: undoStack.length > 0,
          canRedo: false,
        };
      });
    };
    return {
      project: proj,
      mode: 'idle',
      placingModel: null,
      undoStack: [],
      redoStack: [],
      canUndo: false,
      canRedo: false,
      setMode: (mode: Mode, data?: { model?: string }) => {
        set((state) => ({
          ...state,
          mode,
          placingModel: mode === 'placingSpeaker' ? data?.model || null : null,
        }));
      },
      addSpeaker: ({ model, pos }) => apply({ type: 'addSpeaker', model, pos }),
      addMLP: ({ pos }) => apply({ type: 'setMlp', pos }),
      select: (id) => apply({ type: 'selectSpeaker', id }),
      move: (id, pos) =>
        apply(id === 'mlp' ? { type: 'setMlp', pos } : { type: 'moveSpeaker', id, pos }),
      rotate: (id, deg) => {
        if (id !== 'mlp') apply({ type: 'rotateSpeaker', id, deg });
      },
      delete: (id) => {
        if (id === 'mlp') apply({ type: 'deleteMlp' });
        else apply({ type: 'deleteSpeaker', id });
      },
      undo: () => {
        set((state) => {
          if (state.undoStack.length === 0) return state;
          const prev = state.undoStack[state.undoStack.length - 1];
          const undoStack = state.undoStack.slice(0, -1);
          const redoStack = [...state.redoStack, state.project];
          save(prev);
          return {
            ...state,
            project: prev,
            undoStack,
            redoStack,
            canUndo: undoStack.length > 0,
            canRedo: true,
          };
        });
      },
      redo: () => {
        set((state) => {
          if (state.redoStack.length === 0) return state;
          const next = state.redoStack[state.redoStack.length - 1];
          const redoStack = state.redoStack.slice(0, -1);
          const undoStack = [...state.undoStack, state.project];
          save(next);
          return {
            ...state,
            project: next,
            undoStack,
            redoStack,
            canUndo: true,
            canRedo: redoStack.length > 0,
          };
        });
      },
    };
  });
}

export const projectStore = createProjectStore();
