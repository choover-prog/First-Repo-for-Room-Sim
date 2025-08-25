import fs from 'fs';

if (process.argv.length < 4) {
  console.error('Usage: node tools/import_spinorama.mjs data/speakers/FILE.json path/to/spin.csv');
  process.exit(1);
}

const [spPath, csvPath] = process.argv.slice(2);

const speaker = JSON.parse(fs.readFileSync(spPath, 'utf8'));
const csv = fs.readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
const headers = csv.shift().split(',').map(h => h.trim().toLowerCase());
const fields = ['freq_hz','on_axis_db','listening_window_db','early_reflections_db','sound_power_db','di_listening_window_db','di_sound_power_db'];
const idx = Object.fromEntries(fields.map(f => [f, headers.indexOf(f)]));
for (const f of fields) {
  if (idx[f] === -1) {
    console.error(`Missing column: ${f}`);
    process.exit(1);
  }
}
const data = Object.fromEntries(fields.map(f => [f, []]));
for (const line of csv) {
  if (!line.trim()) continue;
  const cells = line.split(',');
  for (const f of fields) {
    const v = parseFloat(cells[idx[f]]) || 0;
    data[f].push(v);
  }
}

speaker.spinorama = data;
if (!speaker.data_quality) speaker.data_quality = {};
if (data.freq_hz.length > 0) {
  speaker.data_quality.tier = 'B';
  speaker.data_quality.confidence_0_1 = Math.max(0.85, speaker.data_quality.confidence_0_1 || 0);
}

fs.writeFileSync(spPath, JSON.stringify(speaker, null, 2));
console.log(`Updated ${spPath} with spinorama data from ${csvPath}`);
