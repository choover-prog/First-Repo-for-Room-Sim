import * as THREE from 'three';
import { computeHeatmap, normalizeHeatmap } from '../lib/lf_heatmap.js';

export class LFHeatmapLayer {
  constructor(scene, parentGroup) {
    this.scene = scene;
    this.group = new THREE.Group();
    (parentGroup || scene).add(this.group);
    this.mesh = null;
    this.enabled = false;
    this.room = { L: 5.0, W: 4.0, H: 2.4 }; // meters default; replace from UI later
  }

  setRoomDims({ L, W, H }) { this.room = { L, W, H }; if (this.enabled) this.update(); }
  setEnabled(on) { this.enabled = !!on; this.group.visible = this.enabled; if (on) this.update(); }

  update() {
    const hm = normalizeHeatmap(computeHeatmap(this.room));
    const { width, height, data } = hm;
    // build a canvas texture for speed
    const cnv = document.createElement('canvas');
    cnv.width = width; cnv.height = height;
    const ctx = cnv.getContext('2d', { willReadFrequently: true });
    const img = ctx.createImageData(width, height);
    for (let i = 0; i < data.length; i++) {
      const v = data[i]; // 0..1
      // blue -> green -> red gradient
      const r = Math.min(255, Math.max(0, Math.floor(255 * v)));
      const g = Math.min(255, Math.max(0, Math.floor(255 * (1 - Math.abs(v - 0.5) * 2))));
      const b = Math.min(255, Math.max(0, Math.floor(255 * (1 - v))));
      const off = i * 4;
      img.data[off] = r; img.data[off+1] = g; img.data[off+2] = b; img.data[off+3] = 160;
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(cnv);
    tex.minFilter = THREE.LinearFilter;
    const planeGeom = new THREE.PlaneGeometry(this.room.L, this.room.W, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    if (this.mesh) this.group.remove(this.mesh);
    this.mesh = new THREE.Mesh(planeGeom, mat);
    this.mesh.rotation.x = -Math.PI/2;
    // center plane at origin per viewer’s centering; adjust if grid uses different origin
    this.group.add(this.mesh);
  }
}
