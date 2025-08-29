import { AnyEquipment } from "../types/equipment";
import { safeParse } from "../lib/validate";
import { log } from "../lib/log";
import { AnyEquipment as AnyEquipmentSchema } from "../types/equipment";

export type EquipmentItem = {
  id: string;
  kind: "speaker" | "amp";
  brand: string;
  model: string;
  price?: number;
  tier?: "A" | "B" | "C";
  confidence?: number; // 0..1
  spinId?: string;
  spinVerified?: boolean;
  specs?: Record<string, string | number | null>;
  provenance?: { source: string; url?: string; date?: string };
};

export type EquipmentManifest = {
  speakers: string[];
  amps: string[];
  updated?: string;
};

async function loadJSON(path: string): Promise<any | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } catch {
    return null;
  }
}

function baseValidate(obj: any, id: string, kind: "speaker" | "amp"): EquipmentItem | null {
  const brand = obj?.brand;
  const model = obj?.model;
  if (!id || !brand || !model) return null;
  const tier = (obj?.tier || obj?.data_quality?.tier || "C") as "A" | "B" | "C";
  const confidence = Number(obj?.confidence ?? obj?.data_quality?.confidence_0_1 ?? 0.5);
  const item: EquipmentItem = {
    id,
    kind,
    brand: String(brand),
    model: String(model),
    price: typeof obj?.price === "number" ? obj.price : undefined,
    tier,
    confidence: isFinite(confidence) ? confidence : 0.5,
    spinId: obj?.spinId,
    specs: obj?.specs || undefined,
    provenance: obj?.provenance || (obj?.sources && obj.sources.length ? { source: obj.sources[0] } : undefined),
  };
  item.spinVerified = !!item.spinId && item.tier === "A";
  // carry legacy fields into specs when present
  if (!item.specs) {
    const specs: Record<string, any> = {};
    ["sensitivity_db", "f_low_f3_hz", "power_w_8ohm_all"].forEach(k => {
      if (obj[k] != null) specs[k] = obj[k];
    });
    if (Object.keys(specs).length) item.specs = specs;
  }
  return item;
}

function validateSpeaker(obj: any, id: string): EquipmentItem | null {
  return baseValidate(obj, id, "speaker");
}

function validateAmp(obj: any, id: string): EquipmentItem | null {
  return baseValidate(obj, id, "amp");
}

export async function fetchEquipment(): Promise<{ speakers: EquipmentItem[]; amps: EquipmentItem[]; errors?: boolean }> {
  const manifest = await loadJSON("/data/manifest.json") as EquipmentManifest | null;
  if (!manifest) throw new Error("manifest");
  const speakers: EquipmentItem[] = [];
  const amps: EquipmentItem[] = [];
  let hadErrors = false;

  const spFiles = manifest.speakers || [];
  for (const path of spFiles) {
    const obj = await loadJSON(`/${path}`);
    if (!obj) { hadErrors = true; continue; }
    const id = path.split("/").pop()?.replace(/\.json$/i, "") || "";
    const item = validateSpeaker(obj, id);
    if (item) speakers.push(item); else hadErrors = true;
  }

  const ampFiles = manifest.amps || [];
  for (const path of ampFiles) {
    const obj = await loadJSON(`/${path}`);
    if (!obj) { hadErrors = true; continue; }
    const id = path.split("/").pop()?.replace(/\.json$/i, "") || "";
    const item = validateAmp(obj, id);
    if (item) amps.push(item); else hadErrors = true;
  }

  const order = { A: 0, B: 1, C: 2 } as Record<string, number>;
  speakers.sort((a, b) => {
    const ta = order[a.tier || "C"]; const tb = order[b.tier || "C"]; if (ta !== tb) return ta - tb;
    return a.brand.localeCompare(b.brand);
  });

  return { speakers, amps, errors: hadErrors };
}

export function normalizeEquipment(rows: any[]): AnyEquipment[] {
  return rows.map(r => safeParse(AnyEquipmentSchema, r)).filter(r => r.ok && r.data).map(r => r.data as AnyEquipment);
}

export async function saveEquipment(items: AnyEquipment[]) {
  log("agent-equipment", "saving", items.length);
}
