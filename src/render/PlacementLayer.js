import * as THREE from 'three';

/**
 * PlacementLayer handles speaker and listener pins in the scene.
 * Provides add/move/remove operations with drag support and
 * persists state in localStorage.
 */
export class PlacementLayer {
  constructor(scene) {
    this.scene = scene;
    this.speakers = new Map();
    this.mlp = null;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.dragging = null;
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1); // y=1 plane

    this.camera = window._placementCamera;
    this.dom = window._placementRenderer?.domElement;

    this.initEvents();
    this.loadState();
  }

  initEvents() {
    if (!this.dom || !this.camera) return;
    this.onPointerDown = this.handlePointerDown.bind(this);
    this.onPointerMove = this.handlePointerMove.bind(this);
    this.onPointerUp = this.handlePointerUp.bind(this);
    this.onContextMenu = this.handleContextMenu.bind(this);

    this.dom.addEventListener('pointerdown', this.onPointerDown);
    this.dom.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    this.dom.addEventListener('contextmenu', this.onContextMenu);
  }

  dispose() {
    if (!this.dom) return;
    this.dom.removeEventListener('pointerdown', this.onPointerDown);
    this.dom.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.dom.removeEventListener('contextmenu', this.onContextMenu);
  }

  setPointer(event) {
    const rect = this.dom.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  intersectFloor() {
    const point = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.plane, point);
    return point;
  }

  handlePointerDown(event) {
    this.setPointer(event);
    const objects = [];
    this.speakers.forEach(s => objects.push(s.mesh));
    if (this.mlp) objects.push(this.mlp.mesh);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(objects, false)[0];
    if (hit) {
      this.dragging = hit.object;
      hit.object.userData.origColor = hit.object.material.color.clone();
      hit.object.material.color.offsetHSL(0, 0, 0.2);
    }
  }

  handlePointerMove(event) {
    if (!this.dragging) return;
    this.setPointer(event);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const p = this.intersectFloor();
    if (!p) return;
    this.dragging.position.set(p.x, 1, p.z);
    const id = this.dragging.userData.id;
    if (this.dragging.userData.type === 'speaker') {
      this.moveSpeaker(id, { x: p.x, y: 1, z: p.z });
    } else if (this.dragging.userData.type === 'mlp') {
      this.setMLP({ x: p.x, y: 1, z: p.z });
    }
  }

  handlePointerUp() {
    if (this.dragging) {
      const obj = this.dragging;
      if (obj.userData.origColor) {
        obj.material.color.copy(obj.userData.origColor);
      }
    }
    this.dragging = null;
  }

  handleContextMenu(event) {
    event.preventDefault();
    this.setPointer(event);
    const objects = [];
    this.speakers.forEach(s => objects.push(s.mesh));
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(objects, false)[0];
    if (hit) {
      this.removeSpeaker(hit.object.userData.id);
    }
  }

  addSpeaker(id, pos) {
    if (this.speakers.has(id)) return;
    const geometry = new THREE.SphereGeometry(0.15, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xff8800 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData = { id, type: 'speaker' };
    this.scene.add(mesh);
    this.speakers.set(id, { mesh });
    // TODO: add SpriteText label
    this.saveState();
  }

  moveSpeaker(id, pos) {
    const entry = this.speakers.get(id);
    if (!entry) return;
    entry.mesh.position.set(pos.x, pos.y, pos.z);
    this.saveState();
  }

  removeSpeaker(id) {
    const entry = this.speakers.get(id);
    if (!entry) return;
    this.scene.remove(entry.mesh);
    entry.mesh.geometry.dispose();
    entry.mesh.material.dispose();
    this.speakers.delete(id);
    this.saveState();
  }

  setMLP(pos) {
    if (!this.mlp) {
      const geometry = new THREE.SphereGeometry(0.15, 16, 16);
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { id: 'mlp', type: 'mlp' };
      this.scene.add(mesh);
      this.mlp = { mesh };
    }
    this.mlp.mesh.position.set(pos.x, pos.y, pos.z);
    this.saveState();
  }

  getState() {
    const speakers = [];
    this.speakers.forEach((s, id) => {
      const p = s.mesh.position;
      speakers.push({ id, pos: { x: p.x, y: p.y, z: p.z } });
    });
    const state = { speakers };
    if (this.mlp) {
      const p = this.mlp.mesh.position;
      state.mlp = { pos: { x: p.x, y: p.y, z: p.z } };
    }
    return state;
  }

  saveState() {
    try {
      localStorage.setItem('app.placement', JSON.stringify(this.getState()));
    } catch (e) {
      console.warn('Placement save failed', e);
    }
  }

  loadState() {
    try {
      const raw = localStorage.getItem('app.placement');
      if (!raw) return;
      const data = JSON.parse(raw);
      data.speakers?.forEach(s => this.addSpeaker(s.id, s.pos));
      if (data.mlp) this.setMLP(data.mlp.pos);
    } catch (e) {
      console.warn('Placement load failed', e);
    }
  }
}

