import { flags } from '../config/flags.js';
import { fetchAmazonPrice } from './affiliates/amazon.js';

export async function withLivePrice(item){
  let price = item.price || null;
  if(flags.pricePoller && import.meta.env.VITE_AMAZON_PA_API_KEY){
    const live = await fetchAmazonPrice(item.asin || item.id);
    if(live) price = live;
  }
  return { ...item, price };
}
