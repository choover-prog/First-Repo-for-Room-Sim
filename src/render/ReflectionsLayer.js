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
      let pair = this.pool[i];
      if (!pair) {
        const geo = new THREE.SphereGeometry(radius, 12, 12);
        const mat = new THREE.MeshBasicMaterial();
        const sphere = new THREE.Mesh(geo, mat);
        const lineMat = new THREE.LineBasicMaterial();
        const lineGeo = new THREE.BufferGeometry();
        const line = new THREE.Line(lineGeo, lineMat);
        pair = { sphere, line };
        this.pool[i] = pair;
      }
      const color = this._colorFor(h.surface);
      pair.sphere.material.color.setHex(color);
      pair.sphere.position.set(h.point[0], h.point[1], h.point[2]);
      if (!pair.sphere.parent) this.group.add(pair.sphere);

      if (h.speaker && h.listener) {
        const pts = [
          new THREE.Vector3(h.speaker[0], h.speaker[1], h.speaker[2]),
          new THREE.Vector3(h.point[0], h.point[1], h.point[2]),
          new THREE.Vector3(h.listener[0], h.listener[1], h.listener[2])
        ];
        pair.line.material.color.setHex(color);
        pair.line.geometry.setFromPoints(pts);
        if (!pair.line.parent) this.group.add(pair.line);
      } else if (pair.line.parent) {
        pair.line.parent.remove(pair.line);
      }
      i++;
    });
    // remove unused items
    for (let j = i; j < this.pool.length; j++) {
      const { sphere, line } = this.pool[j];
      if (sphere.parent) sphere.parent.remove(sphere);
      if (line.parent) line.parent.remove(line);
    }
  }

  dispose() {
    this.pool.forEach(p => {
      p.sphere.geometry.dispose();
      p.sphere.material.dispose();
      p.line.geometry.dispose();
      p.line.material.dispose();
    });
    this.scene.remove(this.group);
  }
}
