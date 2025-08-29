import * as THREE from 'three';

const COLORS = {
  walls: 0xffb000,
  ceiling: 0x00c2c7,
  floor: 0x9b59b6
};

export class ReflectionsLayer {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.visible = false;
    this.pool = [];
    scene.add(this.group);
  }

  setEnabled(flag) {
    this.group.visible = !!flag;
  }

  _colorFor(surface) {
    if (surface === 'ceiling') return COLORS.ceiling;
    if (surface === 'floor') return COLORS.floor;
    return COLORS.walls;
  }

  setHits(hits = []) {
    let i = 0;
    const radius = 0.12;
    hits.forEach(h => {
      let mesh = this.pool[i];
      if (!mesh) {
        const geo = new THREE.SphereGeometry(radius, 12, 12);
        const mat = new THREE.MeshBasicMaterial();
        mesh = new THREE.Mesh(geo, mat);
        this.pool[i] = mesh;
      }
      mesh.material.color.setHex(this._colorFor(h.surface));
      mesh.position.set(h.point[0], h.point[1], h.point[2]);
      if (!mesh.parent) this.group.add(mesh);
      i++;
    });
    // remove unused meshes
    for (let j = i; j < this.pool.length; j++) {
      const m = this.pool[j];
      if (m.parent) m.parent.remove(m);
    }
  }

  dispose() {
    this.pool.forEach(m => {
      m.geometry.dispose();
      m.material.dispose();
    });
    this.scene.remove(this.group);
  }
}
