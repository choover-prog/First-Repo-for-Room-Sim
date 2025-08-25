import * as THREE from 'three';
import { computeHeatmap, normalizeHeatmap } from '../lib/lf_heatmap.js';

export class LFHeatmapLayer {
  constructor(scene, parent) {
    this.scene = scene;
    this.group = new THREE.Group();
    (parent || scene).add(this.group);

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const geo = new THREE.PlaneGeometry(1, 1);
    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.group.add(this.mesh);

    this.L = 5;
    this.W = 4;
    this.H = 2.4;
    this.enabled = false;
    this.group.visible = false;
  }

  setRoomDims({ L, W, H }) {
    this.L = L;
    this.W = W;
    this.H = H;
    this.mesh.scale.set(L, 1, W);
  }

  setEnabled(on) {
    this.enabled = on;
    this.group.visible = !!on;
  }

  update() {
    if (!this.enabled) return;
    const hm = normalizeHeatmap(computeHeatmap({ L: this.L, W: this.W, H: this.H }));
    const { width, height, data } = hm;
    this.canvas.width = width;
    this.canvas.height = height;
    const img = this.ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      const hue = (1 - v) * 240; // blue->red
      const c = new THREE.Color(`hsl(${hue},100%,50%)`);
      const idx = i * 4;
      img.data[idx] = Math.round(c.r * 255);
      img.data[idx + 1] = Math.round(c.g * 255);
      img.data[idx + 2] = Math.round(c.b * 255);
      img.data[idx + 3] = 200;
    }
    this.ctx.putImageData(img, 0, 0);
    this.texture.needsUpdate = true;
  }
}
