import { requiredWattsToHitSPL, headroomDb } from '../lib/spl.js';
import { simplePreferenceScore } from '../lib/preference.js';
import { confidenceFromQuality, blendScore, tierBadge } from '../lib/accuracy.js';
import { getPersonaConfig, isTooltipsEnabled, setTooltipsEnabled } from '../lib/persona.js';

async function loadJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

async function listManifest() {
  const manifest = await loadJSON('/data/manifest.json');
  return manifest;
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

function tipAttr(key, text) {
  return isTooltipsEnabled() ? `data-tip="${key}" title="${text.replace(/"/g,'&quot;')}"` : '';
}

export function mountEquipmentPanel(container) {
  const personaCfg = getPersonaConfig();
  const root = el(`
    <div style="margin-top:12px">
      <h2 style="font-size:16px;margin:8px 0">Equipment</h2>
      <div class="row" ${tipAttr('selectEq','Pick a speaker and amp to evaluate headroom')} >
        <select id="spSel"></select>
        <select id="ampSel"></select>
      </div>
      <div class="row">
        <label ${tipAttr('dist','Distance from speaker to listener in meters')}>Distance (m)
          <input id="dist" type="number" min="1" step="0.1" value="3.0" style="width:80px"/>
        </label>
        <label ${tipAttr('tgt','Peak SPL target (cinema: 105 dB LCR)')}>Target Peak (dB)
          <input id="tgt" type="number" min="85" step="1" value="105" style="width:80px"/>
        </label>
      </div>
      <div id="eqpTier" class="muted" style="margin:6px 0"></div>
      <div id="eqpStats" class="muted"></div>
      <div id="eqpWarn" class="muted" style="color:#ffb3b3"></div>
    </div>
  `);
  container.appendChild(root);

  const spSel  = root.querySelector('#spSel');
  const ampSel = root.querySelector('#ampSel');
  const distEl = root.querySelector('#dist');
  const tgtEl  = root.querySelector('#tgt');
  const tierEl = root.querySelector('#eqpTier');
  const stats  = root.querySelector('#eqpStats');
  const warn   = root.querySelector('#eqpWarn');

  let spData = null, ampData = null, manifest = null;

  function renderTier(q) {
    if (!q) { tierEl.textContent = ''; return; }
    const { label, color } = tierBadge(q.tier);
    const confPct = Math.round(confidenceFromQuality(q) * 100);
    tierEl.innerHTML = `<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${color};color:#0b0d10;font-weight:600">${label} • ${confPct}% confidence
    </span>`;
  }

  function renderStats() {
    if (!spData || !ampData) { stats.textContent = ''; warn.textContent=''; return; }
    const distance = parseFloat(distEl.value || '3');
    const target   = parseFloat(tgtEl.value || '105');
    const wattsReq = requiredWattsToHitSPL(target, spData.sensitivity_db, distance, 1);
    const head     = headroomDb(ampData.power_w_8ohm_all || 50, wattsReq);

    const q = spData.data_quality || { tier: 'D' };
    renderTier(q);

    const rawPref = simplePreferenceScore({
      onAxisVarDb: 2.0,
      bassF10: spData.f_low_f3_hz || 40,
      hasSpin: !!(spData.spinorama && spData.spinorama.freq_hz && spData.spinorama.freq_hz.length)
    });
    const conf = confidenceFromQuality(q);
    const shownPref = blendScore(rawPref, conf);

    stats.innerHTML = `
      Speaker: <b>${spData.brand} ${spData.model}</b> (Sens ${spData.sensitivity_db} dB, F3 ${spData.f_low_f3_hz} Hz)<br/>
      Amp: <b>${ampData.brand} ${ampData.model}</b> (8Ω ${ampData.power_w_8ohm_all || 'n/a'} W)<br/>
      Preference (raw ${rawPref.toFixed(1)}), shown: <b>${shownPref.toFixed(1)}/10</b><br/>
      Required power @${distance}m for ${target} dB peaks: <b>${wattsReq.toFixed(0)} W</b><br/>
      Headroom (8Ω rated): <b>${head.toFixed(1)} dB</b>
    `;
    warn.textContent = head < 0 ? '⚠️ Underpowered for target SPL at this distance.' : '';
  }

  function onChange() {
    const spFile  = spSel.value;
    const ampFile = ampSel.value;
    Promise.all([
      spFile ? loadJSON(`/data/speakers/${spFile}`) : null,
      ampFile ? loadJSON(`/data/amps/${ampFile}`) : null
    ]).then(([sp, amp]) => { spData = sp; ampData = amp; renderStats(); });
  }

  (async () => {
    manifest = await listManifest();
    const spList = manifest.speakers || [];
    const ampList = manifest.amps || [];

    spSel.innerHTML = `<option value="">Select speaker</option>` +
      spList.map(f => `<option value="${f}">${f.replace('.json','').replace(/_/g,' ')}</option>`).join('');
    ampSel.innerHTML = `<option value="">Select amp</option>` +
      ampList.map(f => `<option value="${f}">${f.replace('.json','').replace(/_/g,' ')}</option>`).join('');

    spSel.addEventListener('change', onChange);
    ampSel.addEventListener('change', onChange);
    distEl.addEventListener('input', renderStats);
    tgtEl.addEventListener('input', renderStats);

    // Persona defaults can hide advanced panels later; for now this panel is always visible.
    if (personaCfg && personaCfg.tooltips === false) {
      setTooltipsEnabled(false);
    }
  })();
}
