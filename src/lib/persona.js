const LS_KEYS = {
  persona: 'app.persona',
  tooltips: 'app.tooltipsEnabled',
  onboardingDone: 'app.onboardingDone'
};

const PERSONAS = {
  casual:  { id: 'casual',  label: 'Casual',  showHeatmap: false, showSpinorama: false, exportReport: false, tooltips: true },
  diy:     { id: 'diy',     label: 'DIY',     showHeatmap: true,  showSpinorama: false, exportReport: false, tooltips: true },
  pro:     { id: 'pro',     label: 'Pro',     showHeatmap: true,  showSpinorama: true,  exportReport: true,  tooltips: false },
  reviewer:{ id: 'reviewer',label: 'Reviewer',showHeatmap: true,  showSpinorama: true,  exportReport: true,  tooltips: true }
};

const DEFAULT_PERSONA = 'diy';

export function getPersona() {
  return localStorage.getItem(LS_KEYS.persona) || DEFAULT_PERSONA;
}
export function setPersona(id) {
  localStorage.setItem(LS_KEYS.persona, PERSONAS[id] ? id : DEFAULT_PERSONA);
}
export function getPersonaConfig() {
  const id = getPersona();
  return PERSONAS[id] || PERSONAS[DEFAULT_PERSONA];
}

export function isTooltipsEnabled() {
  const v = localStorage.getItem(LS_KEYS.tooltips);
  if (v === null) return getPersonaConfig().tooltips;
  return v === 'true';
}
export function setTooltipsEnabled(on) {
  localStorage.setItem(LS_KEYS.tooltips, on ? 'true' : 'false');
}

export function isOnboardingDone() {
  return localStorage.getItem(LS_KEYS.onboardingDone) === 'true';
}
export function setOnboardingDone(done) {
  localStorage.setItem(LS_KEYS.onboardingDone, done ? 'true' : 'false');
}

export function personasList() {
  return Object.values(PERSONAS);
}
