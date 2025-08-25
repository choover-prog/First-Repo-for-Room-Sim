export function confidenceFromQuality(q) {
  if (!q) return 0.3;
  const tierBase = { A: 0.9, B: 0.75, C: 0.5, D: 0.25 }[q.tier] ?? 0.3;
  const estPenalty = q.estimation?.used ? 0.1 : 0.0;
  const resBonus = (q.freq_res_hz && q.freq_res_hz <= 2) ? 0.05 : 0;
  const implicit = Math.min(1, Math.max(0, tierBase - estPenalty + resBonus));
  return (typeof q.confidence_0_1 === 'number') ? q.confidence_0_1 : implicit;
}

export function blendScore(modelScore_0_10, confidence_0_1) {
  // Pull predictions toward a neutral baseline when confidence is low.
  const baseline = 7.0;
  return baseline + (modelScore_0_10 - baseline) * (0.5 + 0.5 * confidence_0_1);
}

export function tierBadge(tier) {
  const t = (tier || 'D').toUpperCase();
  const colors = { A: '#20c997', B: '#22b8cf', C: '#fab005', D: '#ff6b6b' };
  return { label: {A:'Gold',B:'Silver',C:'Bronze',D:'Tin'}[t] || 'Tin', color: colors[t] || colors.D };
}
