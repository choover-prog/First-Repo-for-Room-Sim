export function suggestXO({ mainFR = [], subFR = [] }) {
  let xo = 80;
  for (const p of mainFR) {
    if (p.db <= -6) { xo = p.freq; break; }
  }
  return { xo_hz: xo, main_slope: '12dB', sub_slope: '24dB', notes: [] };
}
