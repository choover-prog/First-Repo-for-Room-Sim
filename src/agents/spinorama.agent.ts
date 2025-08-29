import { Spinorama } from "../types/spin";
import { safeParse } from "../lib/validate";
import { log } from "../lib/log";
import { Spinorama as SpinoramaSchema } from "../types/spin";
export async function fetchSpinorama(): Promise<any[]> { return []; }
export function normalizeSpinorama(rows: any[]): Spinorama[] {
  return rows.map(r => safeParse(SpinoramaSchema, r)).filter(r => r.ok && r.data).map(r => r.data as Spinorama);
}
export async function saveSpinorama(items: Spinorama[]){
  log("agent-spinorama", "saving", items.length);
}
