export async function askAI(persona, message) {
  const lower = message.toLowerCase();
  const tone = persona === 'pro' ? 'formal' : 'casual';
  function respond(casual, formal) {
    return tone === 'formal' ? formal : casual;
  }
  if (lower.includes('placement')) {
    return respond(
      'Try keeping speakers about 2 feet from walls and toe them in slightly.',
      'Position the loudspeakers at least 0.6 meters from boundaries and angle them toward the listening position.'
    );
  }
  if (lower.includes('calibration')) {
    return respond(
      'Use the calibration assistant to upload your sweeps and apply the suggested EQ.',
      'Please upload your measurement sweeps to the calibration assistant for equalization suggestions.'
    );
  }
  if (lower.includes('checkout')) {
    return respond(
      'Affiliate items go to the partner site while direct items check out here.',
      'Affiliate line items will be routed to partners; direct goods remain in our checkout.'
    );
  }
  return respond(
    "I'm not sure, but keep exploring!",
    'I am uncertain about that request, please consult detailed documentation.'
  );
}
