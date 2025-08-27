export function saveRoomJSON(room, filename = 'room.json') {
  const blob = new Blob([JSON.stringify(room, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 0);
}

export async function loadRoomJSON(fileOrUrl) {
  let text = '';
  if (typeof fileOrUrl === 'string') {
    const res = await fetch(fileOrUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    text = await res.text();
  } else if (fileOrUrl instanceof File) {
    text = await fileOrUrl.text();
  } else {
    throw new Error('Invalid input');
  }
  const data = JSON.parse(text);
  if (!data.room || !data.objects || !data.mlp) throw new Error('Invalid room.json');
  return data;
}
