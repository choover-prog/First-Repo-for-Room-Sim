import { Camera, Object3D, Raycaster, Scene, Vector2 } from 'three';
import { LAYERS } from './scene.layers';

export interface SelectionContext {
  scene: Scene;
  camera: Camera;
}

export function initSelection(ctx: SelectionContext) {
  const raycaster = new Raycaster();
  raycaster.layers.set(LAYERS.SELECTABLE);
  const pointer = new Vector2();
  let current: Object3D | null = null;
  function pickAt(point: { x: number; y: number }) {
    pointer.set(point.x, point.y);
    raycaster.setFromCamera(pointer, ctx.camera);
    const hits = raycaster.intersectObjects(ctx.scene.children, true);
    return hits[0]?.object || null;
  }
  function select(obj: Object3D | null) {
    current = obj;
    window.dispatchEvent(new CustomEvent('SELECTION_CHANGED', { detail: obj }));
  }
  function clear() {
    current = null;
    window.dispatchEvent(new CustomEvent('SELECTION_CHANGED', { detail: null }));
  }
  return { pickAt, select, clear, get selection() { return current; } };
}
