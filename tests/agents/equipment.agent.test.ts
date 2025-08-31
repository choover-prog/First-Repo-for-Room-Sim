import { describe, it, expect, vi } from "vitest";
import { normalizeEquipment, fetchEquipment } from "../../src/agents/equipment.agent";

describe("equipment agent", () => {
  it("normalizes valid rows", () => {
    const rows = [
      { kind: "speaker", id: "1", brand: "B", model: "M", spec: { form_factor: "tower" } },
      { foo: "bar" }
    ];
    const items = normalizeEquipment(rows);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("1");
  });

  it("fetchEquipment skips invalid entries", async () => {
    const manifest = { speakers: ["good.json", "bad.json"], amps: [] };
    const files: Record<string, any> = {
      "/data/manifest.json": manifest,
      "/good.json": { brand: "B", model: "M" },
      "/bad.json": { foo: "bar" }
    };
    const orig = global.fetch;
    global.fetch = vi.fn((path: string) => {
      const url = String(path);
      const data = files[url];
      if (!data) return Promise.resolve({ ok: false } as any);
      return Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as any);
    });
    const res = await fetchEquipment();
    expect(res.speakers).toHaveLength(1);
    expect(res.errors).toBe(true);
    global.fetch = orig;
  });
});
