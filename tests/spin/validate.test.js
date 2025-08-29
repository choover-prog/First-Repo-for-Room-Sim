import { describe, it, expect } from 'vitest';
import { parseSpinoramaCSV } from '../../src/agents/spinorama.agent.js';

function validCsv() {
  const rows = ['freq_hz,on_axis_db,listening_window_db,early_reflections_db,sound_power_db'];
  for (let i = 0; i < 64; i++) {
    const f = 20 + i * ((20000 - 20) / 63);
    rows.push(`${Math.round(f)},${-i},${-i},${-i},${-i}`);
  }
  return rows.join('\n');
}

describe('spinorama csv validation', () => {
  it('valid csv passes and is verified', () => {
    const res = parseSpinoramaCSV(validCsv());
    expect(res.ok).toBe(true);
    expect(res.data.verified).toBe(true);
  });
  it('missing column fails', () => {
    const csv = 'freq_hz,listening_window_db\n20,0';
    const res = parseSpinoramaCSV(csv);
    expect(res.ok).toBe(false);
  });
  it('non-monotonic freq fails', () => {
    const csv = 'freq_hz,on_axis_db\n20,0\n1000,-1\n990,-2';
    const res = parseSpinoramaCSV(csv);
    expect(res.ok).toBe(false);
  });
});
