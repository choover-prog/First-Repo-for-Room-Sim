import * as THREE from 'three';

export function makeLabelSprite(text, { font = '12px Inter, system-ui', pad = 4 } = {}) {
  const cnv = document.createElement('canvas');
  const ctx = cnv.getContext('2d');
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  const h = 18;
  cnv.width = w;
  cnv.height = h;
  ctx.font = font;
  ctx.fillStyle = 'rgba(15,19,26,0.85)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#e4eaf3';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, pad, h / 2);
  const tex = new THREE.CanvasTexture(cnv);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const spr = new THREE.Sprite(mat);
  spr.scale.set(w * 0.003, h * 0.003, 1);
  return spr;
}
