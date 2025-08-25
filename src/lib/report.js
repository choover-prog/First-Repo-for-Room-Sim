export function captureCanvasPNG(canvas) {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quote.png';
  a.click();
}

export function downloadQuotePDFLike(canvas, cartSnapshot) {
  captureCanvasPNG(canvas);
  const state = typeof window.collectState === 'function' ? window.collectState() : {};
  const json = {
    cart: cartSnapshot,
    room: state.room || null,
    selection: state.selection || null
  };
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quote.json';
  a.click();
  URL.revokeObjectURL(url);
}
