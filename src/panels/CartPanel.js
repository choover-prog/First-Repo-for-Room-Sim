import { checkout } from '../commerce/checkout.js';

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

const badgeStyle = 'display:inline-block;padding:2px 6px;border-radius:4px;background:#2b3a53;font-size:11px;margin-left:4px';

export function mountCartPanel(container, cart) {
  const root = el(`
    <div style="margin-top:12px">
      <h2 style="font-size:16px;margin:8px 0">Cart</h2>
      <div id="cartList" class="muted"></div>
      <button id="checkoutBtn" style="margin-top:8px">Checkout</button>
    </div>
  `);
  container.appendChild(root);

  const list = root.querySelector('#cartList');
  const btn = root.querySelector('#checkoutBtn');

  function render() {
    if (!cart.length) { list.textContent = 'Cart empty'; return; }
    list.innerHTML = cart.map(it => {
      const badges = [];
      if (it.auto_eq) badges.push(`<span style="${badgeStyle}">Auto-EQ Ready</span>`);
      if (it.affiliate) badges.push(`<span style="${badgeStyle}">Affiliate Revenue</span>`);
      return `<div>${it.name} ${badges.join(' ')}</div>`;
    }).join('');
  }

  btn.onclick = () => checkout(cart);
  render();
}
