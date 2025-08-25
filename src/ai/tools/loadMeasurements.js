export async function loadMeasurementsFromFiles(fileList) {
  const files = Array.from(fileList || []);
  const channels = [];
  for (const f of files) {
    const txt = await f.text();
    const rows = txt.split(/\r?\n/);
    const data = [];
    for (const r of rows) {
      const parts = r.trim().split(/[\s,]+/);
      if (parts.length < 2) continue;
      const freq = parseFloat(parts[0]);
      const db = parseFloat(parts[1]);
      if (isFinite(freq) && isFinite(db)) data.push({ freq, db });
    }
    channels.push({ name: f.name, data });
  }
  return { channels };
}
