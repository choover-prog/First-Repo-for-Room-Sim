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
    this.listeners = new Map();
    this.selected = null;

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
    this.listeners.forEach(l => objects.push(l.mesh));
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(objects, false)[0];
    if (hit) {
      this.dragging = hit.object;
      this.selected = hit.object;
      this.updateColors();
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
    } else if (this.dragging.userData.type === 'listener') {
      this.moveListener(id, { x: p.x, y: 1, z: p.z });
    }
  }

  handlePointerUp() {
    this.dragging = null;
    this.updateColors();
  }

  handleContextMenu(event) {
    event.preventDefault();
    this.setPointer(event);
    const objects = [];
    this.speakers.forEach(s => objects.push(s.mesh));
    this.listeners.forEach(l => objects.push(l.mesh));
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(objects, false)[0];
    if (hit) {
      const t = hit.object.userData.type;
      if (t === 'speaker') this.removeSpeaker(hit.object.userData.id);
      else if (t === 'listener') this.removeListener(hit.object.userData.id);
    }
  }

  addSpeaker(id, pos) {
    if (this.speakers.has(id)) return;
    const geometry = new THREE.SphereGeometry(0.15, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xff8800 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData = { id, type: 'speaker', baseColor: 0xff8800 };
    this.scene.add(mesh);
    this.speakers.set(id, { mesh });
    this.updateColors();
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
    if (this.selected === entry.mesh) this.selected = null;
    this.speakers.delete(id);
    this.updateColors();
    this.saveState();
  }
  addListener(id, pos, isMain = false) {
    if (this.listeners.has(id)) return;
    const geometry = new THREE.SphereGeometry(0.15, 16, 16);
    const color = isMain ? 0x00ff00 : 0x009900;
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData = { id, type: 'listener', baseColor: color };
    this.scene.add(mesh);
    this.listeners.set(id, { mesh, isMain });
    this.updateColors();
    this.saveState();
  }

  moveListener(id, pos) {
    const entry = this.listeners.get(id);
    if (!entry) return;
    entry.mesh.position.set(pos.x, pos.y, pos.z);
    this.saveState();
  }

  removeListener(id) {
    const entry = this.listeners.get(id);
    if (!entry) return;
    this.scene.remove(entry.mesh);
    entry.mesh.geometry.dispose();
    entry.mesh.material.dispose();
    if (this.selected === entry.mesh) this.selected = null;
    this.listeners.delete(id);
    this.updateColors();
    this.saveState();
  }

  markSelectedAsMLP() {
    if (!this.selected || this.selected.userData.type !== 'listener') return;
    const selId = this.selected.userData.id;
    this.listeners.forEach((l, id) => {
      l.isMain = id === selId;
    });
    this.updateColors();
    this.saveState();
  }

  updateColors() {
    // restore base colors
    this.speakers.forEach((s) => {
      s.mesh.material.color.setHex(0xff8800);
      s.mesh.userData.baseColor = 0xff8800;
    });
    this.listeners.forEach((l) => {
      const color = l.isMain ? 0x00ff00 : 0x009900;
      l.mesh.material.color.setHex(color);
      l.mesh.userData.baseColor = color;
    });
    if (this.selected) {
      this.selected.material.color.offsetHSL(0, 0, 0.2);
    }
  }

  getState() {
    const speakers = [];
    this.speakers.forEach((s, id) => {
      const p = s.mesh.position;
      speakers.push({ id, pos: { x: p.x, y: p.y, z: p.z } });
    });
    const listeners = [];
    this.listeners.forEach((l, id) => {
      const p = l.mesh.position;
      listeners.push({ id, pos: { x: p.x, y: p.y, z: p.z }, isMain: l.isMain });
    });
    return { speakers, listeners };
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
      data.listeners?.forEach(l => this.addListener(l.id, l.pos, l.isMain));
    } catch (e) {
      console.warn('Placement load failed', e);
    }
  }
}

