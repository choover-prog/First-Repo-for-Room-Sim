import { AnyEquipment } from "../types/equipment";
import { safeParse } from "../lib/validate";
import { log } from "../lib/log";
import { AnyEquipment as AnyEquipmentSchema } from "../types/equipment";
export async function fetchEquipment(): Promise<any[]> { return []; }
export function normalizeEquipment(rows: any[]): AnyEquipment[] {
  return rows.map(r => safeParse(AnyEquipmentSchema, r)).filter(r => r.ok && r.data).map(r => r.data as AnyEquipment);
}
export async function saveEquipment(items: AnyEquipment[]){
  log("agent-equipment", "saving", items.length);
}
