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
    const { project } = this.store.getState();
    if (project.selectedId) {
      this.dragging = true;
    }
  };

  private onUp = () => {
    this.dragging = false;
  };

  private onMove = (e: Event) => {
    if (!this.dragging) return;
    const detail = (e as CustomEvent).detail;
    if (!detail) return;
    const { world } = detail as { world: { x: number; y: number; z: number } };
    const { project, dispatch } = this.store.getState();
    if (!project.selectedId) return;
    dispatch({
      type: 'moveSpeaker',
      id: project.selectedId,
      pos: { x: snap(world.x, SNAP), y: 0, z: snap(world.z, SNAP) },
    });
  };
}

export { snap };
