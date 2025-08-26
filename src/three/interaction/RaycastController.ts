import * as THREE from 'three';
import type { Vec3 } from '../../types/room';

export class RaycastController extends EventTarget {
  private camera: THREE.Camera;
  private dom: HTMLElement;
  private raycaster = new THREE.Raycaster();
  private plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private vec = new THREE.Vector3();

  constructor(camera: THREE.Camera, dom: HTMLElement) {
    super();
    this.camera = camera;
    this.dom = dom;
    dom.addEventListener('pointermove', this.onMove);
  }

  private onMove = (e: PointerEvent) => {
    const rect = this.dom.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(ndc, this.camera);
    this.raycaster.ray.intersectPlane(this.plane, this.vec);
    const world: Vec3 = { x: this.vec.x, y: 0, z: this.vec.z };
    this.dispatchEvent(new CustomEvent('move', { detail: { world } }));
  };
}
