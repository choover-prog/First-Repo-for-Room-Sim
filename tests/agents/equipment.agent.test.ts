import { describe, it, expect } from "vitest";
import { normalizeEquipment } from "../../src/agents/equipment.agent";

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
});
