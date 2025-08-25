import * as THREE from 'three';

function makeMarker(pos, color) {
  const g = new THREE.SphereGeometry(0.05, 8, 8);
  const m = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(g, m);
  mesh.position.set(pos.x, pos.y, pos.z);
  mesh.renderOrder = 999;
  return mesh;
}

export class ReflectionLayer {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
  }
  setPoints({ walls = [], ceiling = [], floor = [] }) {
    this.group.clear();
    walls.forEach(p => this.group.add(makeMarker(p, 0xffbf00))); // amber
    ceiling.forEach(p => this.group.add(makeMarker(p, 0x00bcd4))); // teal
    floor.forEach(p => this.group.add(makeMarker(p, 0x9c27b0))); // purple
  }
  setVisible(v) {
    this.group.visible = v;
  }
}
