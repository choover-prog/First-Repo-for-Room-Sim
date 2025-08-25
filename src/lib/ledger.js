const LS_KEY = 'app.ledger';

export function logTransaction(entry) {
  try {
    const ledger = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    ledger.push({ time: Date.now(), ...entry });
    localStorage.setItem(LS_KEY, JSON.stringify(ledger));
  } catch {
    /* ignore */
  }
  console.log('Ledger entry', entry);
}

export function getLedger() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
}
