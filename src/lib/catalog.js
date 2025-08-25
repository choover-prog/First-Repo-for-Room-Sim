let catalog = null;

export async function loadCatalog() {
  if (catalog) return catalog;
  const cats = ['speakers', 'amps', 'subs', 'panels'];
  const data = { allBySku: {} };
  for (const c of cats) {
    try {
      const res = await fetch(`/data/catalog/${c}.json`);
      const arr = res.ok ? await res.json() : [];
      data[c] = arr;
      for (const item of arr) data.allBySku[item.sku] = item;
    } catch (e) {
      data[c] = [];
    }
  }
  catalog = data;
  return catalog;
}

export function findSku(sku) {
  return catalog && catalog.allBySku[sku];
}

export function searchCatalog(q) {
  if (!catalog) return [];
  q = (q || '').toLowerCase();
  return Object.values(catalog.allBySku).filter(it =>
    it.sku.toLowerCase().includes(q) ||
    it.brand.toLowerCase().includes(q) ||
    it.model.toLowerCase().includes(q)
  );
}
