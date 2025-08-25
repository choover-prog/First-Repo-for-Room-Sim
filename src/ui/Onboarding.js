import { personasList, setPersona, isOnboardingDone, setOnboardingDone, setTooltipsEnabled } from '../lib/persona.js';

function css() {
  if (document.getElementById('onboardCSS')) return;
  const style = document.createElement('style');
  style.id = 'onboardCSS';
  style.textContent = `
  .ob-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999}
  .ob-card{background:#11141a;border:1px solid #232832;border-radius:12px;max-width:520px;width:92%;padding:16px;color:#e8eaed;box-shadow:0 8px 40px rgba(0,0,0,.6)}
  .ob-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}
  .ob-btn{border:1px solid #2a3140;background:#0f131a;color:#e8eaed;padding:10px;border-radius:10px;cursor:pointer}
  .ob-btn:hover{background:#16202b}
  .ob-row{display:flex;justify-content:space-between;align-items:center;margin-top:8px}
  `;
  document.head.appendChild(style);
}

async function fetchTemplates() {
  const r = await fetch('/data/rooms/templates.json');
  if (r.ok) return r.json();
  return [];
}
async function fetchManifest() {
  const r = await fetch('/data/manifest.json');
  if (r.ok) return r.json();
  return {speakers:[],amps:[]};
}

export async function mountOnboarding(root=document.body, force=false) {
  if (!force && isOnboardingDone()) return;
  css();
  const wrap = document.createElement('div');
  wrap.className = 'ob-backdrop';
  wrap.innerHTML = `<div class="ob-card"><div id="obStep"></div><div class="ob-row"><button class="ob-btn" id="obBack" style="display:none">Back</button><div><button class="ob-btn" id="obSkip">Skip</button><button class="ob-btn" id="obNext">Next</button></div></div></div>`;
  const stepEl = wrap.querySelector('#obStep');
  const nextBtn = wrap.querySelector('#obNext');
  const backBtn = wrap.querySelector('#obBack');
  const skipBtn = wrap.querySelector('#obSkip');

  const templates = await fetchTemplates();
  const manifest = await fetchManifest();

  const state = { persona:null, tips:true, tpl:null, sp:null, amp:null };
  let step = 0;

  function renderPersona() {
    stepEl.innerHTML = `<h2 style="margin:0 0 8px">Choose persona</h2><div class="ob-grid" id="obGrid"></div><label style="margin-top:8px;display:block"><input id="obTips" type="checkbox" checked/> Show tooltips</label>`;
    const grid = stepEl.querySelector('#obGrid');
    personasList().forEach(p => {
      const b = document.createElement('button');
      b.className = 'ob-btn';
      b.textContent = p.label;
      b.onclick = () => { state.persona = p.id; [...grid.children].forEach(c=>c.style.outline=''); b.style.outline='2px solid #22b8cf'; };
      grid.appendChild(b);
    });
    stepEl.querySelector('#obTips').onchange = e => state.tips = e.target.checked;
  }
  function renderRoom() {
    const opts = templates.map(t=>`<option value="${t.id}">${t.label}</option>`).join('');
    stepEl.innerHTML = `<h2 style="margin:0 0 8px">Room template</h2><select id="obTpl"><option value="">Select...</option>${opts}</select>`;
    stepEl.querySelector('#obTpl').onchange = e => state.tpl = e.target.value;
  }
  function renderEquip() {
    const spOpts = manifest.speakers.map(f=>`<option value="${f}">${f.replace('.json','').replace(/_/g,' ')}</option>`).join('');
    const ampOpts = manifest.amps.map(f=>`<option value="${f}">${f.replace('.json','').replace(/_/g,' ')}</option>`).join('');
    stepEl.innerHTML = `<h2 style="margin:0 0 8px">Select gear</h2><div class="ob-grid"><select id="obSp"><option value="">Speaker</option>${spOpts}</select><select id="obAmp"><option value="">Amp</option>${ampOpts}</select></div>`;
    stepEl.querySelector('#obSp').onchange = e => state.sp = e.target.value;
    stepEl.querySelector('#obAmp').onchange = e => state.amp = e.target.value;
  }

  function render() {
    backBtn.style.display = step === 0 ? 'none' : 'inline-block';
    nextBtn.textContent = step === 2 ? 'Done' : 'Next';
    if (step === 0) renderPersona();
    else if (step === 1) renderRoom();
    else renderEquip();
  }

  nextBtn.onclick = () => {
    if (step === 2) {
      if (state.persona) setPersona(state.persona);
      setTooltipsEnabled(state.tips);
      if (state.tpl) localStorage.setItem('app.roomTemplateId', state.tpl);
      if (state.sp) localStorage.setItem('app.selected.speaker', state.sp);
      if (state.amp) localStorage.setItem('app.selected.amp', state.amp);
      setOnboardingDone(true);
      root.removeChild(wrap);
    } else { step++; render(); }
  };
  backBtn.onclick = () => { if (step>0) { step--; render(); } };
  skipBtn.onclick = () => { setOnboardingDone(true); root.removeChild(wrap); };

  render();
  root.appendChild(wrap);
}
