import { CatalogItem } from "../types/commerce";
import { safeParse } from "../lib/validate";
import { log } from "../lib/log";
import { CatalogItem as CatalogItemSchema } from "../types/commerce";
export async function fetchCatalog(): Promise<any[]> { return []; }
export function normalizeCatalog(rows: any[]): CatalogItem[] {
  return rows.map(r => safeParse(CatalogItemSchema, r)).filter(r => r.ok && r.data).map(r => r.data as CatalogItem);
}
export async function saveCatalog(items: CatalogItem[]){
  log("agent-commerce", "saving", items.length);
}
