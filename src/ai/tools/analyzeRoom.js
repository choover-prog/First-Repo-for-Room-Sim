export async function analyzeRoom(files) {
  let text = null;
  const arr = Array.from(files || []);
  for (const f of arr) {
    if (f.name === 'room.json') {
      text = await f.text();
      break;
    }
  }
  if (!text) {
    try {
      const res = await fetch('/project/room.json');
      if (res.ok) text = await res.text();
    } catch (_) {}
  }
  if (!text) return {};
  try {
    const json = JSON.parse(text);
    return {
      dims: json.dims || {},
      seats: json.seats || [],
      subs: json.subs || [],
      mains: json.mains || []
    };
  } catch (e) {
    return {};
  }
}
