export function computeHeatmap({ L, W, H, freqs = [30,40,50,63,80,100,120], res = 48 }) {
  const width = res;
  const height = res;
  const data = new Float32Array(width * height);
  let min = Infinity;
  let max = -Infinity;
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const x = (i / (width - 1)) * L;
      const z = (j / (height - 1)) * W;
      let v = 0;
      for (const f of freqs) {
        const k = (2 * Math.PI * f) / 343; // simple wavenumber
        v += Math.sin(k * x) * Math.sin(k * z);
      }
      data[j * width + i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  return { width, height, data, min, max };
}

export function normalizeHeatmap(hm) {
  const { data } = hm;
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;
  for (let i = 0; i < data.length; i++) {
    data[i] = (data[i] - min) / range;
  }
  hm.min = 0;
  hm.max = 1;
  return hm;
}
