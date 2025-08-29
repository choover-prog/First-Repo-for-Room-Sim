import Papa from 'papaparse';
import { SpinCSVRow, SpinSet } from '../types/spin.js';
import { setSpinForEquipment } from '../lib/spin/store.js';

export function parseSpinoramaCSV(text, meta = {}) {
  const result = Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true });
  if (result.errors && result.errors.length) {
    return { ok: false, reason: result.errors[0].message };
  }
  const headers = result.meta.fields || [];
  if (!headers.includes('freq_hz') || !headers.includes('on_axis_db')) {
    return { ok: false, reason: 'missing required columns freq_hz and on_axis_db' };
  }
  const rows = [];
  let lastFreq = 0;
  for (const r of result.data) {
    const parsed = SpinCSVRow.safeParse(r);
    if (!parsed.success) return { ok: false, reason: parsed.error.message };
    if (parsed.data.freq_hz <= lastFreq) {
      return { ok: false, reason: 'freq_hz must be strictly increasing' };
    }
    rows.push(parsed.data);
    lastFreq = parsed.data.freq_hz;
  }
  if (rows.length < 64) {
    return { ok: false, reason: 'not enough rows (min 64)' };
  }
  if (rows[0].freq_hz > 30 || rows[rows.length - 1].freq_hz < 18000) {
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
    rows,
    confidence_0_1: confidence,
    source: meta.source,
    verified: confidence >= 0.7
  };
  const validated = SpinSet.safeParse(spin);
  if (!validated.success) return { ok: false, reason: validated.error.message };
  return { ok: true, data: validated.data };
}

export function importSpinorama(text, meta = {}) {
  const res = parseSpinoramaCSV(text, meta);
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
