export function toMiniDSP(filters = []) {
  return filters.map((f, i) => `${i+1},PEQ,${f.f},${f.q},${f.gain}`).join('\n');
}

export function toMultEQX(filters = []) {
  const header = 'Filter,Type,Frequency,Q,Gain';
  const rows = filters.map((f,i)=>`${i+1},PEQ,${f.f},${f.q},${f.gain}`);
  return [header, ...rows].join('\n');
}

export function toDiracJSON(targetCurve = []) {
  return JSON.stringify({ filters: targetCurve }, null, 2);
}
