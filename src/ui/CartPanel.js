import { loadCatalog } from '../lib/catalog.js';
import { checkout } from '../commerce/checkout.js';

export function mountCartPanel() {
  const root = document.createElement('div');
  root.id = 'cartPanel';
  root.style = 'position:fixed;right:20px;top:60px;width:300px;background:#1f2a3a;padding:12px;color:#d8e1f0;display:none;z-index:1000';
  root.innerHTML = `
    <h3 style="margin-top:0">Catalog</h3>
    <ul id="catalogList"></ul>
    <h3>Cart</h3>
    <ul id="cartList"></ul>
    <div>Total: $<span id="cartTotal">0.00</span></div>
    <button id="checkoutBtn">Checkout</button>
  `;
  document.body.appendChild(root);

  const catalogList = root.querySelector('#catalogList');
  const cartList    = root.querySelector('#cartList');
  const totalEl     = root.querySelector('#cartTotal');
  const checkoutBtn = root.querySelector('#checkoutBtn');

  const cart = [];

  loadCatalog().then(items => {
    items.forEach(item => {
      const li  = document.createElement('li');
      li.textContent = `${item.brand} ${item.model} - $${item.price_usd}`;
      const btn = document.createElement('button');
      btn.textContent = 'Add';
      btn.onclick = () => { cart.push(item); renderCart(); };
      li.appendChild(btn);
      catalogList.appendChild(li);
    });
  });

  function renderCart() {
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price_usd;
      const li = document.createElement('li');
      li.textContent = `${item.brand} ${item.model} - $${item.price_usd}`;
      const btn = document.createElement('button');
      btn.textContent = 'Remove';
      btn.onclick = () => { cart.splice(idx,1); renderCart(); };
      li.appendChild(btn);
      cartList.appendChild(li);
    });
    totalEl.textContent = total.toFixed(2);
  }

  checkoutBtn.onclick = () => checkout(cart);

  return {
    show: () => (root.style.display = 'block'),
    hide: () => (root.style.display = 'none'),
    toggle: () => {
      root.style.display = root.style.display === 'none' ? 'block' : 'none';
    }
  };
}
