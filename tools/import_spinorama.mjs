import fs from 'node:fs';
import path from 'node:path';

function parseCSV(txt) {
  const lines = txt.trim().split(/\r?\n/);
  const head = lines.shift().split(',').map(s=>s.trim());
  const rows = lines.map(l => l.split(',').map(s=>s.trim()));
  return { head, rows };
}

/**
Expected CSV columns (case-insensitive):
freq_hz,on_axis_db,listening_window_db,early_reflections_db,sound_power_db,di_listening_window_db,di_sound_power_db
Missing columns are allowed; they’ll be omitted.
Usage:
node tools/import_spinorama.mjs data/speakers/JBL_Studio_590.json path/to/spinorama.csv
*/
const [ , , speakerJsonPath, csvPath ] = process.argv;
if (!speakerJsonPath || !csvPath) {
  console.error('Usage: node tools/import_spinorama.mjs <speaker.json> <spinorama.csv>');
  process.exit(1);
}
const csv = fs.readFileSync(csvPath, 'utf8');
const { head, rows } = parseCSV(csv);
const idx = Object.fromEntries(head.map((h,i)=>[h.toLowerCase(), i]));

function pick(row, key) {
  const i = idx[key]; if (i==null) return null;
  const v = row[i]; if (v==null || v==='') return null;
  return Number(v);
}

const freq = [];
const series = {
  on_axis_db: [], listening_window_db: [], early_reflections_db: [],
  sound_power_db: [], di_listening_window_db: [], di_sound_power_db: []
};

for (const r of rows) {
  const f = pick(r, 'freq_hz'); if (isNaN(f)) continue;
  freq.push(f);
  for (const k of Object.keys(series)) {
    const v = pick(r, k);
    if (v==null || isNaN(v)) { series[k].push(null); } else { series[k].push(v); }
  }
}

const spPath = path.resolve(speakerJsonPath);
const sp = JSON.parse(fs.readFileSync(spPath, 'utf8'));
sp.spinorama = { freq_hz: freq, ...series };

// upgrade quality tier & confidence if we have enough data
sp.data_quality = sp.data_quality || {};
if (freq.length > 200 && series.on_axis_db.filter(v=>v!=null).length > 150) {
  sp.data_quality.tier = sp.data_quality.tier === 'A' ? 'A' : 'B'; // conservatively B unless fully verified
  sp.data_quality.spin_format = 'cta2034';
  sp.data_quality.confidence_0_1 = Math.max(0.85, sp.data_quality.confidence_0_1 || 0.85);
}

fs.writeFileSync(spPath, JSON.stringify(sp, null, 2));
console.log(`Updated spinorama for ${sp.brand} ${sp.model} with ${freq.length} points.`);
