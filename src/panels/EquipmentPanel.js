import { tierToBadge, confidenceToPercent } from '../lib/accuracy.js';

export function mountEquipmentPanel(root=document) {
  const wrap = root.getElementById('equipPanel') || root.getElementById('ui');
  if (!wrap) return;

  // Speaker selector (expects a <select id="spSel"> if index.html already has it)
  let spSel = root.getElementById('spSel');
  if (!spSel) {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <label>Speaker:
        <select id="spSel">
          <option value="">(select)</option>
        </select>
      </label>
      <span id="spBadges"></span>`;
    wrap.appendChild(row);
    spSel = row.querySelector('#spSel');
  }

  // Load manifest if available and populate
  fetch('/data/manifest.json').then(r => r.ok ? r.json() : null).then(async (man) => {
    if (!man?.speakers) return;
    for (const id of man.speakers) {
      const o = document.createElement('option');
      o.value = id;
      o.textContent = id.replace(/_/g,' ');
      spSel.appendChild(o);
    }
  }).catch(()=>{});

  spSel?.addEventListener('change', async () => {
    const val = spSel.value;
    const badgeWrap = root.getElementById('spBadges');
    if (!val || !badgeWrap) return;
    badgeWrap.textContent = '';
    try {
      const sp = await (await fetch(`/data/speakers/${val}.json`)).json();
      const tier = sp?.data_quality?.tier || 'C';
      const conf = confidenceToPercent(sp?.data_quality?.confidence_0_1 ?? 0.5);
      const t = tierToBadge(tier);
      const bTier = document.createElement('span');
      bTier.textContent = `Tier ${t.label}`;
      bTier.style.cssText = `display:inline-block;padding:2px 8px;border-radius:999px;margin-right:6px;color:#0b0d10;background:${t.color}`;
      const bConf = document.createElement('span');
      bConf.textContent = `${conf}% conf.`;
      bConf.style.cssText = `display:inline-block;padding:2px 8px;border-radius:999px;margin-right:6px;background:#34495e;color:#ecf0f1`;
      badgeWrap.appendChild(bTier);
      badgeWrap.appendChild(bConf);
    } catch {}
  });
}
