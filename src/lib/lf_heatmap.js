export function computeHeatmap({ L, W, H, freqs = [30, 40, 50, 63, 80, 100, 120], res = 48 }) {
  // Very lightweight scalar field combining X and Y axial standing waves.
  // Output: { width:res, height:res, data: Float32Array(res*res), min, max }
  const field = new Float32Array(res * res);
  const c = 343;
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < res; i++) {
    const y = (i + 0.5) / res * W;
    for (let j = 0; j < res; j++) {
      const x = (j + 0.5) / res * L;
      let p = 0;
      for (const f of freqs) {
        // approximate axial nodes for x & y directions
        const kx = Math.PI / L, ky = Math.PI / W;
        // weight frequency with gentle equalization; avoid overbias to LF
        const w = 1 / Math.sqrt(f);
        const px = Math.abs(Math.sin(kx * x * (f / (c / (2*1/L))))) * w;
        const py = Math.abs(Math.sin(ky * y * (f / (c / (2*1/W))))) * w;
        p += (px + py) * 0.5;
      }
      const idx = i * res + j;
      field[idx] = p;
      if (p < min) min = p;
      if (p > max) max = p;
    }
  }
  return { width: res, height: res, data: field, min, max };
}

export function normalizeHeatmap(hm) {
  const out = new Float32Array(hm.data.length);
  const rng = Math.max(1e-6, hm.max - hm.min);
  for (let i = 0; i < hm.data.length; i++) out[i] = (hm.data[i] - hm.min) / rng;
  return { ...hm, data: out, min: 0, max: 1 };
}
