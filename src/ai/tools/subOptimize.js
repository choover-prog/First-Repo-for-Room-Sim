export async function optimizeSubs({ measurements, seats = [], subs = [] }) {
  const perSub = subs.map(s => ({ id: s.id || s, delay_ms: 0, gain_db: 0, polarity: 1 }));
  const score = { avg: 0, variance: 0 };
  const notes = ['Stub optimizer'];
  return { perSub, score, notes };
}
