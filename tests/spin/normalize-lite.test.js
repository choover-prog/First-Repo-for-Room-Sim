import { describe, it, expect } from 'vitest';
import { parseCSV } from '../../src/lib/csv-lite.js';
import { normalizeSpinRows } from '../../src/agents/spinorama.agent.js';

function validCsv() {
  const rows = ['freq_hz,on_axis_db,listening_window_db,early_reflections_db,sound_power_db'];
  for (let i = 0; i < 64; i++) {
    const f = 20 + i * ((20000 - 20) / 63);
    rows.push(`${Math.round(f)},${-i},${-i},${-i},${-i}`);
  }
  return rows.join('\n');
}

describe('spin csv normalization', () => {
  it('valid csv verified', () => {
    const { rows } = parseCSV(validCsv());
    const res = normalizeSpinRows(rows, {});
    expect(res.ok).toBe(true);
    expect(res.data.verified).toBe(true);
  });

  it('missing column fails', () => {
    const { rows } = parseCSV('on_axis_db\n0');
    const res = normalizeSpinRows(rows);
    expect(res.ok).toBe(false);
  });

  it('non-monotonic freq fails', () => {
    const { rows } = parseCSV('freq_hz,on_axis_db\n20,0\n1000,-1\n990,-2');
    const res = normalizeSpinRows(rows);
    expect(res.ok).toBe(false);
  });

  it('too few rows fails', () => {
    const lines = ['freq_hz,on_axis_db'];
    for (let i = 0; i < 10; i++) lines.push(`${20 + i},${-i}`);
    const { rows } = parseCSV(lines.join('\n'));
    const res = normalizeSpinRows(rows);
    expect(res.ok).toBe(false);
  });
});
