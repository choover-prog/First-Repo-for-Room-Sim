export function reportFindings(state = {}) {
  const lines = [];
  if (state.delays) lines.push('Delays set for subs.');
  if (state.filters) lines.push(`${state.filters.length} PEQ filters ready.`);
  if (state.xo) lines.push(`Crossover at ${state.xo} Hz.`);
  return lines.join('\n') || 'No actions yet.';
}
