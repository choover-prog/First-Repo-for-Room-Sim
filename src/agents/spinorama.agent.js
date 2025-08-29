import { parseCSV } from '../lib/csv-lite.js';
import { SpinCSVRow, SpinSet } from '../types/spin.js';
import { setSpinForEquipment } from '../lib/spin/store.js';

export async function parseSpinCSV(file) {
  const text = await file.text();
  const { rows } = parseCSV(text);
  return rows; // array of objects keyed by header
}

export function normalizeSpinRows(rows, meta = {}) {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  if (!headers.includes('freq_hz') || !headers.includes('on_axis_db')) {
    return { ok: false, reason: 'missing required columns freq_hz and on_axis_db' };
  }
  const validRows = [];
  let lastFreq = 0;
  const cleanNum = (v) => {
    if (v === undefined || v === '') return undefined;
    const n = Number(String(v).replace(/,/g, ''));
    return Number.isNaN(n) ? undefined : n;
  };
  for (const r of rows) {
    const freq = cleanNum(r.freq_hz);
    if (freq === undefined || freq <= 0) {
      return { ok: false, reason: 'invalid freq_hz' };
    }
    const parsed = SpinCSVRow.safeParse({
      freq_hz: freq,
      on_axis_db: cleanNum(r.on_axis_db),
      listening_window_db: cleanNum(r.listening_window_db),
      early_reflections_db: cleanNum(r.early_reflections_db),
      sound_power_db: cleanNum(r.sound_power_db),
      di_listening_window_db: cleanNum(r.di_listening_window_db),
      di_sound_power_db: cleanNum(r.di_sound_power_db),
    });
    if (!parsed.success) return { ok: false, reason: parsed.error.message };
    if (parsed.data.freq_hz <= lastFreq) {
      return { ok: false, reason: 'freq_hz must be strictly increasing' };
    }
    validRows.push(parsed.data);
    lastFreq = parsed.data.freq_hz;
  }
  if (validRows.length < 64) {
    return { ok: false, reason: 'not enough rows (min 64)' };
  }
  if (validRows[0].freq_hz > 30 || validRows[validRows.length - 1].freq_hz < 18000) {
    return { ok: false, reason: 'frequency range must cover roughly 20-20kHz' };
  }
  let confidence = 0.4;
  if (headers.includes('listening_window_db')) confidence += 0.15;
  if (headers.includes('early_reflections_db')) confidence += 0.15;
  if (headers.includes('sound_power_db')) confidence += 0.2;
  confidence = Math.min(confidence, 1);
  const spin = {
    id: meta.id || `spin-${Date.now()}`,
    equip_id: meta.equip_id,
    brand: meta.brand,
    model: meta.model,
    rows: validRows,
    confidence_0_1: confidence,
    source: meta.source,
    verified: confidence >= 0.7
  };
  const validated = SpinSet.safeParse(spin);
  if (!validated.success) return { ok: false, reason: validated.error.message };
  return { ok: true, data: validated.data };
}

export function parseSpinoramaCSV(text, meta = {}) {
  const { rows } = parseCSV(text);
  return normalizeSpinRows(rows, meta);
}

export function importSpinorama(rows, meta = {}) {
  const res = normalizeSpinRows(rows, meta);
  if (!res.ok) return res;
  const spin = res.data;
  let equipId = spin.equip_id;
  if (!equipId && spin.brand && spin.model) {
    equipId = `${spin.brand}_${spin.model}`.replace(/\s+/g, '_');
  }
  if (equipId) {
    setSpinForEquipment(equipId, spin);
  }
  return { ok: true, data: spin };
}
