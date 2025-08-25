import { parseREW, suggestFilters, exportMiniDSP, exportDirac } from '../lib/calibration.js';

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

export function mountCalibrationPanel(container) {
  const root = el(`
    <div style="margin-top:12px" id="calPanel">
      <h2 style="font-size:16px;margin:8px 0">Calibration</h2>
      <input type="file" id="calFile" accept=".json"/>
      <div id="calList" class="muted" style="margin-top:8px"></div>
      <div class="row" style="margin-top:8px">
        <button id="expMiniDSP">Export MiniDSP JSON</button>
        <button id="expDirac">Export Dirac TXT</button>
      </div>
    </div>
  `);
  container.appendChild(root);

  const file = root.querySelector('#calFile');
  const list = root.querySelector('#calList');
  const miniBtn = root.querySelector('#expMiniDSP');
  const diracBtn = root.querySelector('#expDirac');

  let filters = [];

  file.onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    const txt = await f.text();
    const data = JSON.parse(txt);
    const { freq, mag } = parseREW(data);
    filters = suggestFilters(freq, mag);
    list.innerHTML = filters.length
      ? '<ul>' + filters.map(f => `<li>${f.freq} Hz, ${f.gain.toFixed(1)} dB, Q ${f.q}</li>`).join('') + '</ul>'
      : 'No peaks detected';
  };

  function download(content, name) {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
  }

  miniBtn.onclick = () => { if (filters.length) download(exportMiniDSP(filters), 'minidsp.json'); };
  diracBtn.onclick = () => { if (filters.length) download(exportDirac(filters), 'dirac.txt'); };
}
