import { requiredWattsToHitSPL, headroomDb } from '../lib/spl.js';
import { simplePreferenceScore } from '../lib/preference.js';
import { confidenceFromQuality, blendScore } from '../lib/accuracy.js';
import { getPersonaConfig, isTooltipsEnabled, setTooltipsEnabled } from '../lib/persona.js';
import { getSpin } from '../lib/spin/store.js';
import { SpinoramaBadge } from '../ui/Badges.js';
import { mountInto, PANE_IDS } from '../ui/panes.ts';
import { fetchEquipment } from '../agents/equipment.agent';
import './equipment.css';

let _selected = { speaker: null, amp: null };
export function getSelectedEquipment() {
  const res = { speakers: [], amps: [] };
  if (_selected.speaker) res.speakers.push(_selected.speaker);
  if (_selected.amp) res.amps.push(_selected.amp);
  return res;
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

function tipAttr(key, text) {
  return isTooltipsEnabled() ? `data-tip="${key}" title="${text.replace(/"/g,'&quot;')}"` : '';
}

export function mountEquipmentPanel() {
  const personaCfg = getPersonaConfig();
  const root = el(`
    <div id="equipment-pane" class="section">
      <h3>Equipment</h3>
      <div id="equipment-status" class="status-row"></div>
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
      <div id="equipment-spin-section"></div>
    </div>
  `);
  mountInto(PANE_IDS.right, root);

  const spSel  = root.querySelector('#spSel');
  const ampSel = root.querySelector('#ampSel');
  const distEl = root.querySelector('#dist');
  const tgtEl  = root.querySelector('#tgt');
  const tierEl = root.querySelector('#eqpTier');
  const stats  = root.querySelector('#eqpStats');
  const warn   = root.querySelector('#eqpWarn');
  const status = root.querySelector('#equipment-status');

  let spData = null, ampData = null;
  const spMap = new Map();
  const ampMap = new Map();

  function renderBadges() {
    tierEl.innerHTML = '';
    const parts = [];
    if (spData) {
      parts.push(`Speaker: <span>${spData.brand} ${spData.model}</span>`);
      parts.push(`<span class="eq-badge tier${spData.tier || 'C'}">${spData.tier || 'C'}</span>`);
      parts.push(`<span class="eq-badge">conf ${(spData.confidence ?? 0.5).toFixed(2)}</span>`);
      if (spData.spinVerified) parts.push(`<span class="eq-badge spin">Spinorama Verified</span>`);
      if (spData.provenance?.source) parts.push(`<span>${spData.provenance.source}</span>`);
      parts.push('<br/>');
    }
    if (ampData) {
      parts.push(`Amp: <span>${ampData.brand} ${ampData.model}</span>`);
      parts.push(`<span class="eq-badge tier${ampData.tier || 'C'}">${ampData.tier || 'C'}</span>`);
      parts.push(`<span class="eq-badge">conf ${(ampData.confidence ?? 0.5).toFixed(2)}</span>`);
      if (ampData.provenance?.source) parts.push(`<span>${ampData.provenance.source}</span>`);
    }
    tierEl.innerHTML = parts.join(' ');
  }

  function renderStats() {
    if (!spData || !ampData) { stats.textContent = ''; warn.textContent=''; renderBadges(); return; }
    const distance = parseFloat(distEl.value || '3');
    const target   = parseFloat(tgtEl.value || '105');
    const sens = spData.specs?.sensitivity_db || spData.sensitivity_db || 85;
    const f3   = spData.specs?.f_low_f3_hz || spData.f_low_f3_hz || 40;
    const ampPower = ampData.specs?.power_w_8ohm_all || ampData.power_w_8ohm_all || 50;
    const wattsReq = requiredWattsToHitSPL(target, sens, distance, 1);
    const head     = headroomDb(ampPower, wattsReq);

    const q = { tier: spData.tier || 'C', confidence_0_1: spData.confidence ?? 0.5 };
    renderBadges();

    const rawPref = simplePreferenceScore({
      onAxisVarDb: 2.0,
      bassF10: f3,
      hasSpin: !!spData.spinId
    });
    const conf = confidenceFromQuality({ tier: q.tier, confidence_0_1: q.confidence_0_1 });
    const shownPref = blendScore(rawPref, conf);
    const spin = spData.spinId ? getSpin(spData.spinId) : null;
    stats.innerHTML = `
      Speaker: <b class="speaker-name">${spData.brand} ${spData.model}</b> (Sens ${sens} dB, F3 ${f3} Hz)<br/>
      Amp: <b>${ampData.brand} ${ampData.model}</b> (8Ω ${ampPower || 'n/a'} W)<br/>
      Preference (raw ${rawPref.toFixed(1)}), shown: <b>${shownPref.toFixed(1)}/10</b><br/>
      Required power @${distance}m for ${target} dB peaks: <b>${wattsReq.toFixed(0)} W</b><br/>
      Headroom (8Ω rated): <b>${head.toFixed(1)} dB</b>
    `;
    if (spin && spin.verified) {
      const badge = SpinoramaBadge();
      badge.setAttribute('title', `CEA-2034 data imported; confidence: ${spin.confidence_0_1.toFixed(2)}; source: ${spin.source || 'N/A'}`);
      stats.querySelector('.speaker-name')?.appendChild(badge);
    }
    warn.textContent = head < 0 ? '⚠️ Underpowered for target SPL at this distance.' : '';
  }

  function onChange() {
    const spId  = spSel.value;
    const ampId = ampSel.value;
    spData = spMap.get(spId) || null;
    ampData = ampMap.get(ampId) || null;
    _selected.speaker = spData;
    _selected.amp = ampData;
    if (spId) localStorage.setItem('eqp.speaker', spId); else localStorage.removeItem('eqp.speaker');
    if (ampId) localStorage.setItem('eqp.amp', ampId); else localStorage.removeItem('eqp.amp');
    renderStats();
  }

  (async () => {
    try {
      const eq = await fetchEquipment();
      eq.speakers.forEach(s => { spMap.set(s.id, s); });
      eq.amps.forEach(a => { ampMap.set(a.id, a); });
      spSel.innerHTML = `<option value="">Select speaker</option>` +
        eq.speakers.map(f => `<option value="${f.id}">${f.brand} ${f.model}</option>`).join('');
      ampSel.innerHTML = `<option value="">Select amp</option>` +
        eq.amps.map(f => `<option value="${f.id}">${f.brand} ${f.model}</option>`).join('');
      if (eq.errors) status.textContent = 'Some items failed to load. Showing others.';
      const spPrev = localStorage.getItem('eqp.speaker');
      const ampPrev = localStorage.getItem('eqp.amp');
      if (spPrev && spMap.has(spPrev)) { spSel.value = spPrev; spData = spMap.get(spPrev); _selected.speaker = spData; }
      if (ampPrev && ampMap.has(ampPrev)) { ampSel.value = ampPrev; ampData = ampMap.get(ampPrev); _selected.amp = ampData; }
      renderStats();
    } catch {
      status.textContent = 'Manifest error; equipment unavailable.';
    }

    spSel.addEventListener('change', onChange);
    ampSel.addEventListener('change', onChange);
    distEl.addEventListener('input', renderStats);
    tgtEl.addEventListener('input', renderStats);

    if (personaCfg && personaCfg.tooltips === false) {
      setTooltipsEnabled(false);
    }
  })();
}
