# Media-Room-Cal-Sim (Starter)

Open `public/index.html` to test viewer.

## Commerce

- Catalog files in `data/catalog/*.json` follow:
  ```json
  {
    "sku": "SKU",
    "brand": "Brand",
    "model": "Model",
    "category": "speaker",
    "price_usd": 0,
    "images": [],
    "affiliate": { "retailer": "https://..." },
    "badges": { "tier": "A", "confidence": 0.9 },
    "notes": "",
    "options": []
  }
  ```
- Cart persists in `localStorage` and can check out via **Affiliate** links or a stub **Direct** flow.
- Add your affiliate IDs by editing the links in catalog JSON.
- Test: select equipment → "Add to Cart" → open Cart → Checkout.
- "Export Quote" saves a PNG snapshot and cart JSON.
