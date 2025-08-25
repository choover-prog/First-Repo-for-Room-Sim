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

export function mountOnboarding(root=document.body) {
  if (isOnboardingDone()) return;
  css();
  const wrap = document.createElement('div');
  wrap.className = 'ob-backdrop';
  wrap.innerHTML = `
    <div class="ob-card">
      <h2 style="margin:0 0 8px 0">Choose how you’ll use the app</h2>
      <div style="opacity:.8">You can change this later in Settings.</div>
      <div class="ob-grid" id="obGrid"></div>
      <div class="ob-row">
        <label><input id="obTips" type="checkbox" checked/> Show tooltips</label>
        <div>
          <button class="ob-btn" id="obSkip">Skip</button>
          <button class="ob-btn" id="obDone">Done</button>
        </div>
      </div>
      <label style="display:block;margin-top:8px;"><input id="obDont" type="checkbox"/> Don’t show again</label>
    </div>
  `;
  const grid = wrap.querySelector('#obGrid');
  const tips = wrap.querySelector('#obTips');
  const dont = wrap.querySelector('#obDont');

  let selected = null;
  personasList().forEach(p => {
    const b = document.createElement('button');
    b.className = 'ob-btn';
    b.textContent = `${p.label}`;
    b.onclick = () => { selected = p.id; [...grid.children].forEach(c=>c.style.outline=''); b.style.outline='2px solid #22b8cf'; };
    grid.appendChild(b);
  });

  wrap.querySelector('#obSkip').onclick = () => {
    setOnboardingDone(dont.checked);
    root.removeChild(wrap);
  };
  wrap.querySelector('#obDone').onclick = () => {
    if (selected) setPersona(selected);
    setTooltipsEnabled(!!tips.checked);
    setOnboardingDone(dont.checked);
    root.removeChild(wrap);
  };

  root.appendChild(wrap);
}
