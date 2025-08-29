import { MeasurementSet } from "../types/calibration";
import { safeParse } from "../lib/validate";
import { log } from "../lib/log";
import { MeasurementSet as MeasurementSetSchema } from "../types/calibration";
export async function fetchCalibrations(): Promise<any[]> { return []; }
export function normalizeCalibrations(rows: any[]): MeasurementSet[] {
  return rows.map(r => safeParse(MeasurementSetSchema, r)).filter(r => r.ok && r.data).map(r => r.data as MeasurementSet);
}
export async function saveCalibrations(items: MeasurementSet[]){
  log("agent-calibration", "saving", items.length);
}
