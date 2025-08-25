export async function buildReport({ canvas, state, badges }) {
  const img = canvas.toDataURL('image/png');
  const w = window.open('','_blank');
  w.document.write(`<img src="${img}" style="max-width:100%"/><pre>${JSON.stringify({state,badges},null,2)}</pre>`);
  w.document.close();
  w.focus();
  w.print();
}
