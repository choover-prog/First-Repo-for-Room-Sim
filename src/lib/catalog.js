let catalogCache = null;

export async function loadCatalog() {
  if (catalogCache) return catalogCache;
  const res = await fetch('/data/catalog/manifest.json');
  if (!res.ok) throw new Error('Failed to load catalog manifest');
  const manifest = await res.json();
  const items = [];
  for (const file of manifest.products || []) {
    const r = await fetch(`/data/catalog/${file}`);
    if (r.ok) items.push(await r.json());
  }
  catalogCache = items;
  return items;
}

export function getCatalog() {
  return catalogCache;
}
