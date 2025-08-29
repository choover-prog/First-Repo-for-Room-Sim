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
    // draw on top of room geometry
    this.group.renderOrder = 1e6;
    this.linePool = [];
    this.markerPool = [];
    this.showMarkers = true;
    this.lengthClamp = 20;
    this.opacity = 0.6;
    scene.add(this.group);
  }

  setEnabled(flag) {
    this.group.visible = !!flag;
  }

  configure(opts = {}) {
    if ('showMarkers' in opts) this.showMarkers = !!opts.showMarkers;
    if ('lengthClamp' in opts) this.lengthClamp = +opts.lengthClamp || this.lengthClamp;
    if ('opacity' in opts) this.opacity = +opts.opacity;
    // update existing materials
    this.linePool.forEach(l => l.material.opacity = this.opacity);
    this.markerPool.forEach(m => m.material.opacity = this.opacity);
    this.markerPool.forEach(m => m.visible = this.showMarkers && m.visible);
  }

  _colorFor(surface) {
    if (surface === 'ceiling') return COLORS.ceiling;
    if (surface === 'floor') return COLORS.floor;
    return COLORS.walls;
  }

  /**
   * Render reflection paths
   * @param {Array} paths - [{speaker:[x,y,z], hit:[x,y,z], mlp:[x,y,z], surface}]
   */
  setPaths(paths = []) {
    let i = 0;
    const radius = 0.12;
    paths.forEach(p => {
      const a = new THREE.Vector3(...p.speaker);
      const b = new THREE.Vector3(...p.hit);
      const c = new THREE.Vector3(...p.mlp);
      const total = a.distanceTo(b) + b.distanceTo(c);
      if (total > this.lengthClamp) return; // skip long paths

      // line
      let line = this.linePool[i];
      if (!line) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3));
        const mat = new THREE.LineBasicMaterial({ transparent: true, depthTest: false, depthWrite: false });
        line = new THREE.Line(geo, mat);
        this.linePool[i] = line;
        this.group.add(line);
      }
      line.material.color.setHex(this._colorFor(p.surface));
      line.material.opacity = this.opacity;
      const arr = line.geometry.attributes.position.array;
      arr[0]=a.x; arr[1]=a.y; arr[2]=a.z;
      arr[3]=b.x; arr[4]=b.y; arr[5]=b.z;
      arr[6]=c.x; arr[7]=c.y; arr[8]=c.z;
      line.geometry.attributes.position.needsUpdate = true;
      line.visible = true;

      // marker
      let mark = this.markerPool[i];
      if (!mark) {
        const geo = new THREE.SphereGeometry(radius, 12, 12);
        const mat = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false });
        mark = new THREE.Mesh(geo, mat);
        this.markerPool[i] = mark;
        this.group.add(mark);
      }
      mark.material.color.setHex(this._colorFor(p.surface));
      mark.material.opacity = this.opacity;
      mark.position.copy(b);
      mark.visible = this.showMarkers;
      i++;
    });

    // hide unused
    for (let j = i; j < this.linePool.length; j++) {
      const l = this.linePool[j];
      if (l) l.visible = false;
      const m = this.markerPool[j];
      if (m) m.visible = false;
    }
  }

  dispose() {
    this.linePool.forEach(l => {
      l.geometry.dispose();
      l.material.dispose();
    });
    this.markerPool.forEach(m => {
      m.geometry.dispose();
      m.material.dispose();
    });
    this.scene.remove(this.group);
  }
}
