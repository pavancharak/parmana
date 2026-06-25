import { describe, it, expect } from "vitest";
import { ReplayEngine } from "../src/ReplayEngine.js";

describe("ReplayEngine - Deterministic Execution", () => {
  it("should produce identical replay results", () => {
    const engine = new ReplayEngine();

    const input = [
      { id: "1", action: "A" },
      { id: "2", action: "B" }
    ];

    const r1 = engine.replay(input, {});
    const r2 = engine.replay(input, {});

    expect(r1).toEqual(r2);
  });

  it("should preserve execution order", () => {
    const engine = new ReplayEngine();

    const input = [
      { id: "1" },
      { id: "2" }
    ];

    const result = engine.replay(input, {});

    expect(result.executionOrder).toEqual(["1", "2"]);
  });
});