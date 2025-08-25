import { cart } from '../lib/cart.js';
import { renderBadges } from './Badges.js';
import { downloadQuotePDFLike } from '../lib/report.js';

export function mountCartPanel({ rootEl, onCheckout }) {
  const panel = document.createElement('div');
  panel.id = 'cartPanel';
  panel.innerHTML = `
    <h2 style="margin-top:0">Cart</h2>
    <div id="cartItems"></div>
    <div id="cartSub" style="margin:8px 0"></div>
    <label>Mode:
      <select id="checkoutMode">
        <option value="affiliate">Affiliate</option>
        <option value="direct">Direct</option>
      </select>
    </label>
    <div class="row" style="margin-top:8px;gap:8px">
      <button id="btnCheckout" class="primary">Checkout</button>
      <button id="btnQuote">Export Quote</button>
    </div>
    <div id="cartRecs" style="margin-top:12px;font-size:12px;opacity:.8"><small>based on items in cart</small></div>
  `;
  panel.style = 'position:fixed;top:0;right:-320px;width:320px;height:100%;background:#11141a;border-left:1px solid #232832;padding:16px;transition:right .3s;overflow:auto;z-index:2000';
  rootEl.appendChild(panel);

  const style = document.createElement('style');
  style.textContent = `#cartPanel.open{right:0} #cartPanel img{width:48px;height:48px;object-fit:cover;border-radius:4px}`;
  document.head.appendChild(style);

  function render() {
    const list = panel.querySelector('#cartItems');
    list.innerHTML = cart.items.map(it => `
      <div class="row" style="align-items:center;margin:6px 0">
        <img src="${(it.images && it.images[0]) || ''}" alt=""/>
        <div style="flex:1">
          <div>${it.brand} ${it.model}</div>
          <div class="muted" style="font-size:11px">${renderBadges(it)}</div>
        </div>
        <div style="text-align:right">
          $${(it.price_usd * it.qty).toFixed(2)}<br/>
          <button data-act="dec" data-sku="${it.sku}">-</button>
          <span>${it.qty}</span>
          <button data-act="inc" data-sku="${it.sku}">+</button>
          <button data-act="rem" data-sku="${it.sku}" title="Remove">x</button>
        </div>
      </div>
    `).join('');
    panel.querySelector('#cartSub').textContent = `Subtotal: $${cart.subtotal().toFixed(2)} (tax est.)`;
    panel.querySelector('#checkoutMode').value = cart.mode;
  }
  render();
  window.addEventListener('cart:change', render);

  panel.addEventListener('click', e => {
    const sku = e.target.dataset.sku;
    const act = e.target.dataset.act;
    if (!sku || !act) return;
    if (act === 'inc') cart.setQty(sku, cart.items.find(i=>i.sku===sku).qty + 1);
    if (act === 'dec') cart.setQty(sku, cart.items.find(i=>i.sku===sku).qty - 1);
    if (act === 'rem') cart.remove(sku);
  });

  panel.querySelector('#checkoutMode').onchange = e => {
    cart.mode = e.target.value;
    localStorage.setItem('checkout.mode', cart.mode);
    window.dispatchEvent(new CustomEvent('cart:change'));
  };
  panel.querySelector('#btnCheckout').onclick = () => onCheckout && onCheckout(cart.mode);
  panel.querySelector('#btnQuote').onclick = () => {
    const canvas = document.querySelector('canvas');
    downloadQuotePDFLike(canvas, cart.toJSON());
  };

  return { toggle: () => panel.classList.toggle('open') };
}
