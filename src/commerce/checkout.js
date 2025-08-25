export async function checkoutAffiliate(cart) {
  const win = window.open('', '_blank');
  if (!win) return { ok: false };
  win.document.write('<h1>Checkout</h1>');
  cart.items.forEach(it => {
    if (!it.affiliate) return;
    win.document.write(`<h3>${it.brand} ${it.model}</h3>`);
    for (const [name, url] of Object.entries(it.affiliate)) {
      win.document.write(`<div><a href="${url}" target="_blank">${name}</a></div>`);
    }
  });
  return { ok: true };
}

export async function checkoutDirect(cart) {
  alert('Direct checkout not yet enabled.');
  return { ok: false, message: 'Direct checkout not yet enabled' };
}
