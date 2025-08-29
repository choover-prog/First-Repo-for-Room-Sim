import { AnalyticEvent } from "../types/analytics";
import { safeParse } from "../lib/validate";
import { log } from "../lib/log";
import { AnalyticEvent as AnalyticEventSchema } from "../types/analytics";
export async function fetchAnalytics(): Promise<any[]> { return []; }
export function normalizeAnalytics(rows: any[]): AnalyticEvent[] {
  return rows.map(r => safeParse(AnalyticEventSchema, r)).filter(r => r.ok && r.data).map(r => r.data as AnalyticEvent);
}
export async function saveAnalytics(items: AnalyticEvent[]){
  log("agent-analytics", "saving", items.length);
}
