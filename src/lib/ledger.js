const entries = [];

export function log(txn){
  const e = { ...txn, ts: Date.now() };
  entries.push(e);
  console.log('[ledger]', e);
}

export function snapshot(){
  return entries.slice();
}

export function exportJSON(){
  const blob = new Blob([JSON.stringify(snapshot(), null, 2)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ledger.json';
  a.click();
}
