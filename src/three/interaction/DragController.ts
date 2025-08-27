import type { StoreApi, ProjectState } from '../../state/projectStore';
import { RaycastController } from './RaycastController';

const SNAP = 0.0762; // 0.25 ft in meters
const snap = (v: number, g: number) => Math.round(v / g) * g;

export class DragController {
  private store: StoreApi<ProjectState>;
  private ray: RaycastController;
  private dom: HTMLElement;
  private dragging = false;

  constructor(store: StoreApi<ProjectState>, ray: RaycastController, dom: HTMLElement) {
    this.store = store;
    this.ray = ray;
    this.dom = dom;
    dom.addEventListener('pointerdown', this.onDown);
    dom.addEventListener('pointerup', this.onUp);
    ray.addEventListener('move', this.onMove as EventListener);
  }

  private onDown = () => {
    const { project, mode, setMode } = this.store.getState();
    if (mode === 'idle' && project.selectedId) {
      this.dragging = true;
      setMode('dragging');
    }
  };

  private onUp = () => {
    if (this.dragging) {
      this.dragging = false;
      this.store.getState().setMode('idle');
    }
  };

  private onMove = (e: Event) => {
    if (!this.dragging) return;
    const detail = (e as CustomEvent).detail;
    if (!detail) return;
    const { world } = detail as { world: { x: number; y: number; z: number } };
    const { project, move } = this.store.getState();
    if (!project.selectedId) return;
    move(project.selectedId, {
      x: snap(world.x, SNAP),
      y: 0,
      z: snap(world.z, SNAP),
    });
  };
}

export { snap };
