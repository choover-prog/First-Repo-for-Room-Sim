/* @vitest-environment jsdom */
import { describe, it, expect, beforeEach } from 'vitest';
import { createProjectStore } from '../src/state/projectStore';

const pos = { x: 1, y: 0, z: 2 };

describe('projectStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds and selects speaker', () => {
    const store = createProjectStore();
    store.getState().dispatch({ type: 'addSpeaker', model: 'A', pos });
    const state = store.getState();
    expect(state.project.speakers).toHaveLength(1);
    const id = state.project.speakers[0].id;
    expect(state.project.selectedId).toBe(id);
    // persisted
    const raw = localStorage.getItem('project/current');
    expect(raw && JSON.parse(raw).speakers).toHaveLength(1);
  });

  it('moves speaker', () => {
    const store = createProjectStore();
    store.getState().dispatch({ type: 'addSpeaker', model: 'A', pos });
    const id = store.getState().project.selectedId!;
    store.getState().dispatch({ type: 'moveSpeaker', id, pos: { x: 2, y: 0, z: 3 } });
    const sp = store.getState().project.speakers[0];
    expect(sp.pos).toEqual({ x: 2, y: 0, z: 3 });
  });

  it('deletes speaker', () => {
    const store = createProjectStore();
    store.getState().dispatch({ type: 'addSpeaker', model: 'A', pos });
    const id = store.getState().project.selectedId!;
    store.getState().dispatch({ type: 'deleteSpeaker', id });
    expect(store.getState().project.speakers).toHaveLength(0);
    expect(store.getState().project.selectedId).toBeNull();
  });

  it('undo and redo', () => {
    const store = createProjectStore();
    // add two speakers
    store.getState().dispatch({ type: 'addSpeaker', model: 'A', pos });
    const id1 = store.getState().project.selectedId!;
    store.getState().dispatch({ type: 'addSpeaker', model: 'B', pos });
    const id2 = store.getState().project.selectedId!;
    // select first
    store.getState().dispatch({ type: 'selectSpeaker', id: id1 });
    expect(store.getState().project.selectedId).toBe(id1);
    // undo selection -> should select id2
    store.getState().undo();
    expect(store.getState().project.selectedId).toBe(id2);
    // undo add B -> left with A selected
    store.getState().undo();
    expect(store.getState().project.speakers).toHaveLength(1);
    expect(store.getState().project.selectedId).toBe(id1);
    // redo add B
    store.getState().redo();
    expect(store.getState().project.speakers).toHaveLength(2);
    // redo selection
    store.getState().redo();
    expect(store.getState().project.selectedId).toBe(id1);
  });

  it('persists to localStorage', () => {
    const store = createProjectStore();
    store.getState().dispatch({ type: 'addSpeaker', model: 'A', pos });
    const id = store.getState().project.selectedId!;
    store.getState().dispatch({ type: 'moveSpeaker', id, pos: { x: 4, y: 0, z: 5 } });
    // create new store -> hydrate
    const store2 = createProjectStore();
    const sp = store2.getState().project.speakers[0];
    expect(sp.pos).toEqual({ x: 4, y: 0, z: 5 });
  });
});
