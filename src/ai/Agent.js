import { loadMeasurementsFromFiles } from './tools/loadMeasurements.js';
import { analyzeRoom } from './tools/analyzeRoom.js';
import { optimizeSubs } from './tools/subOptimize.js';
import { suggestXO } from './tools/xoverSuggest.js';
import { makePEQ } from './tools/peqSuggest.js';
import { toMiniDSP, toMultEQX, toDiracJSON } from './tools/exportFilters.js';
import { reportFindings } from './tools/reportFindings.js';

export async function askAgent({ messages = [], files = [], useCloud = false }) {
  if (useCloud) {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { messages: [{ role: 'assistant', content: 'Cloud error: ' + err.message }], suggestedActions: [] };
    }
  }

  const last = messages[messages.length - 1];
  const text = (last && last.content ? last.content : '').toLowerCase();
  const suggestedActions = [];
  const fileArray = Array.from(files || []);
  let measurements = null;
  if (fileArray.length) measurements = await loadMeasurementsFromFiles(fileArray);
  const room = await analyzeRoom(fileArray);
  let reply = '';

  if (text.includes('time') && text.includes('sub')) {
    const res = await optimizeSubs({ measurements, seats: room.seats, subs: room.subs });
    reply = 'Calculated sub delays and gains.';
    res.perSub.forEach(p => suggestedActions.push({ type: 'set-delay', subId: p.id, ms: p.delay_ms, gain: p.gain_db, polarity: p.polarity }));
  }
  else if (text.includes('crossover') || text.includes('xo')) {
    if (measurements && measurements.channels.length >= 2) {
      const res = suggestXO({ mainFR: measurements.channels[0].data, subFR: measurements.channels[1].data });
      reply = `Try crossover at ${res.xo_hz} Hz.`;
      suggestedActions.push({ type: 'set-xo', hz: res.xo_hz });
    } else {
      reply = 'Need main and sub measurements.';
    }
  }
  else if (text.includes('peq')) {
    if (measurements && measurements.channels.length) {
      const filters = makePEQ({ averageFR: measurements.channels[0].data });
      reply = `Generated ${filters.length} filters.`;
      suggestedActions.push({ type: 'apply-peq', filters });
    } else {
      reply = 'Need measurements to suggest PEQ.';
    }
  }
  else if (text.includes('export')) {
    reply = 'Export filters via MiniDSP, MultEQ-X or Dirac.';
  }
  else if (text.includes('checklist')) {
    reply = reportFindings({});
  }
  else {
    reply = 'How can I help?';
  }

  return { messages: [{ role: 'assistant', content: reply }], suggestedActions };
}
