export function parseREW(json) {
  const freq = json.frequency || json.freq || [];
  const mag = json.magnitude || json.mag || [];
  return { freq, mag };
}

export function suggestFilters(freq, mag) {
  if (!freq.length || freq.length !== mag.length) return [];
  const avg = mag.reduce((a, b) => a + b, 0) / mag.length;
  const pairs = freq.map((f, i) => ({ f, m: mag[i] }));
  pairs.sort((a, b) => b.m - a.m);
  return pairs.slice(0, 3).map(p => ({ freq: p.f, gain: Math.min(0, avg - p.m), q: 4 }));
}

export function exportMiniDSP(filters) {
  return JSON.stringify({ filters: filters.map(f => ({ type: 'PEQ', ...f })) }, null, 2);
}

export function exportDirac(filters) {
  return filters.map((f, i) => `Filter ${i + 1}: ON PK Fc ${f.freq} Hz Gain ${f.gain.toFixed(1)} dB Q ${f.q}`)
    .join('\n');
}
