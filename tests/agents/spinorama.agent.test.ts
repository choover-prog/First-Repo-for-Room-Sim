import { describe, it, expect } from "vitest";
import { normalizeSpinorama } from "../../src/agents/spinorama.agent";

describe("spinorama agent", () => {
  it("normalizes valid rows", () => {
    const rows = [
      { id: "s1", rows: [{ freq_hz: 100, on_axis_db: 0 }], confidence_0_1: 0.5 }
    ];
    const items = normalizeSpinorama(rows);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("s1");
  });
});
