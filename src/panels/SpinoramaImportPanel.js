import { parseSpinCSV, normalizeSpinRows, importSpinorama } from '../agents/spinorama.agent.js';

export function mountSpinoramaImportPanel() {
  const host = document.getElementById('spinImport');
  if (!host) return;
  host.innerHTML = `
    <div style="margin-top:12px">
      <h3 style="font-size:14px;margin:8px 0">Spinorama Import</h3>
      <input type="file" id="spinFile" accept=".csv" />
      <div id="spinPreview" class="muted" style="font-size:12px;margin-top:4px"></div>
      <button id="spinApply" disabled>Apply Import</button>
      <div id="spinError" style="color:#ff6b6b;font-size:12px;margin-top:4px"></div>
    </div>
  `;
  const fileInput = host.querySelector('#spinFile');
  const preview = host.querySelector('#spinPreview');
  const applyBtn = host.querySelector('#spinApply');
  const errEl = host.querySelector('#spinError');
  let currentRows = null;
  let currentMeta = null;
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const rows = await parseSpinCSV(file);
    const res = normalizeSpinRows(rows, { source: file.name });
    if (!res.ok) {
      errEl.textContent = res.reason;
      preview.textContent = '';
      applyBtn.disabled = true;
      currentRows = null;
      currentMeta = null;
      return;
    }
    currentRows = rows;
    currentMeta = { source: file.name };
    const first = res.data.rows.slice(0, 5).map(r => `${r.freq_hz} Hz → ${r.on_axis_db} dB`).join('<br/>');
    preview.innerHTML = `${first}<br/>Rows: ${rows.length}<br/>Confidence: ${(res.data.confidence_0_1 * 100).toFixed(0)}%`;
    errEl.textContent = '';
    applyBtn.disabled = false;
  });
  applyBtn.addEventListener('click', () => {
    if (!currentRows) return;
    const spSel = document.getElementById('spSel');
    const equipId = spSel ? spSel.value.replace('.json', '') : null;
    if (!equipId) {
      errEl.textContent = 'Select a speaker first';
      return;
    }
    const res = importSpinorama(currentRows, { ...currentMeta, equip_id: equipId });
    if (!res.ok) {
      errEl.textContent = res.reason;
      return;
    }
    errEl.textContent = 'Spinorama data applied';
    applyBtn.disabled = true;
  });
}
