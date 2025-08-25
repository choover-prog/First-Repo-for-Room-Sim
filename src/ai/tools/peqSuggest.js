export function makePEQ({ averageFR = [], target = 'harman-light', maxFilters = 8, maxBoost = 3 }) {
  const filters = [];
  const sorted = averageFR.slice().sort((a,b) => b.db - a.db);
  for (const p of sorted) {
    if (p.db > maxBoost && filters.length < maxFilters) {
      filters.push({ f: p.freq, q: 4, gain: -Math.min(maxBoost, p.db) });
    }
  }
  return filters;
}
