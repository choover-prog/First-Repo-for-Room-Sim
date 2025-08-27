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

export interface ProjectState {
  project: Project;
  undoStack: Project[];
  redoStack: Project[];
  canUndo: boolean;
  canRedo: boolean;
  dispatch: (cmd: Command) => void;
  undo: () => void;
  redo: () => void;
}

export type Command =
  | { type: 'addSpeaker'; model: string; pos?: Vec3; rotY?: number }
  | { type: 'selectSpeaker'; id: string | null }
  | { type: 'moveSpeaker'; id: string; pos: Vec3 }
  | { type: 'deleteSpeaker'; id: string }
  | { type: 'setMlp'; pos: Vec3 }
  | { type: 'deleteMlp' };

const VERSION = '1';
const DATA_KEY = 'project/current';
const VER_KEY = 'project/version';

const defaultProject: Project = { speakers: [], mlp: null, selectedId: null };

function save(project: Project) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(project));
    localStorage.setItem(VER_KEY, VERSION);
  } catch {}
}

function hydrate(): Project {
  try {
    if (localStorage.getItem(VER_KEY) === VERSION) {
      const raw = localStorage.getItem(DATA_KEY);
      if (raw) return JSON.parse(raw) as Project;
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
    case 'setMlp': {
      return { ...project, mlp: { ...cmd.pos } };
    }
    case 'deleteMlp': {
      return { ...project, mlp: null };
    }
    default:
      return project;
  }
}

export function createProjectStore(initial?: Project): StoreApi<ProjectState> {
  const proj = initial || hydrate();
  const store = createStore<ProjectState>((set, get) => ({
    project: proj,
    undoStack: [],
    redoStack: [],
    canUndo: false,
    canRedo: false,
    dispatch: (cmd: Command) => {
      set((state) => {
        const prev = state.project;
        const next = reduce(prev, cmd);
        const undoStack = [...state.undoStack, prev];
        const newState = {
          project: next,
          undoStack,
          redoStack: [],
          canUndo: undoStack.length > 0,
          canRedo: false,
        };
        save(next);
        return newState;
      });
    },
    undo: () => {
      set((state) => {
        if (state.undoStack.length === 0) return state;
        const prev = state.undoStack[state.undoStack.length - 1];
        const undoStack = state.undoStack.slice(0, -1);
        const redoStack = [...state.redoStack, state.project];
        save(prev);
        return {
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
          project: next,
          undoStack,
          redoStack,
          canUndo: true,
          canRedo: redoStack.length > 0,
        };
      });
    },
  }));
  return store;
}

export const projectStore = createProjectStore();
