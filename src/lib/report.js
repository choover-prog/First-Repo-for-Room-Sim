export async function captureCanvasPNG(canvas) {
  return new Promise(resolve => canvas.toBlob(b => {
    const url = URL.createObjectURL(b);
    resolve(url);
  }, 'image/png'));
}

export function downloadBlobURL(url, filename) {
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 5000);
}

export function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadBlobURL(url, filename);
}
