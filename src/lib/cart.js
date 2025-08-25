const stored = localStorage.getItem('app.cart');

function persist(cart) {
  localStorage.setItem('app.cart', JSON.stringify(cart.items));
  localStorage.setItem('checkout.mode', cart.mode);
}

function emit() {
  window.dispatchEvent(new CustomEvent('cart:change'));
}

export const cart = {
  items: stored ? JSON.parse(stored) : [],
  mode: localStorage.getItem('checkout.mode') || 'affiliate',
  add(item, qty = 1) {
    const existing = this.items.find(i => i.sku === item.sku);
    if (existing) existing.qty += qty;
    else this.items.push({ ...item, qty });
    persist(this);
    emit();
  },
  remove(sku) {
    this.items = this.items.filter(i => i.sku !== sku);
    persist(this);
    emit();
  },
  setQty(sku, qty) {
    const it = this.items.find(i => i.sku === sku);
    if (it) {
      it.qty = qty;
      if (it.qty <= 0) this.remove(sku);
      persist(this);
      emit();
    }
  },
  subtotal() {
    return this.items.reduce((s, i) => s + i.price_usd * i.qty, 0);
  },
  clear() {
    this.items = [];
    persist(this);
    emit();
  },
  toJSON() {
    return { items: this.items, mode: this.mode };
  },
  fromJSON(data) {
    this.items = data.items || [];
    this.mode = data.mode || this.mode;
    persist(this);
    emit();
  }
};
