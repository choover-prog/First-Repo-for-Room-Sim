import { sendOrder } from '../lib/distributor.js';
import { logTransaction } from '../lib/ledger.js';

export function checkout(cart) {
  const affiliate = cart.filter(i => i.affiliate);
  const direct = cart.filter(i => !i.affiliate);

  let mode = 'empty';
  if (affiliate.length && direct.length) {
    mode = 'hybrid';
    console.log('Hybrid checkout detected');
    sendOrder({ items: direct });
    console.log('Affiliate items:', affiliate);
  } else if (affiliate.length) {
    mode = 'affiliate';
    console.log('Affiliate checkout:', affiliate);
  } else if (direct.length) {
    mode = 'direct';
    sendOrder({ items: direct });
    console.log('Direct checkout');
  } else {
    console.log('Cart empty');
  }
  const res = { affiliate, direct };
  logTransaction({ cart, state: res, revenue: cart.reduce((s,i)=>s+(i.price||0),0), mode });
  return res;
}
