import { tierBadge, confidenceFromQuality } from '../lib/accuracy.js';

export function renderBadges(item) {
  if (!item || !item.badges) return '';
  const { tier, confidence } = item.badges;
  const { label, color } = tierBadge(tier);
  const conf = Math.round((confidence || confidenceFromQuality(item.badges)) * 100);
  return `<span style="display:inline-block;padding:2px 6px;border-radius:8px;background:${color};color:#0b0d10;font-size:10px;margin-right:4px">${label}</span><span class="muted">${conf}%</span>`;
}
