export function tierToBadge(tier='C') {
  const map = { A:'#2ecc71', B:'#3498db', C:'#f1c40f', D:'#e67e22', F:'#e74c3c' };
  return { label: tier, color: map[tier] || '#bdc3c7' };
}
export function confidenceToPercent(v=0.5) {
  const n = Math.max(0, Math.min(1, Number(v)));
  return Math.round(n * 100);
}
