export function simplePreferenceScore({ onAxisVarDb = 1, bassF10 = 40, hasSpin = false }) {
  let score = 7.0;
  score -= Math.max(0, onAxisVarDb - 1) * 0.5;
  score += Math.max(0, (60 - Math.min(bassF10, 60)) / 10);
  score += hasSpin ? 0.5 : -0.5;
  return Math.max(0, Math.min(10, score));
}
