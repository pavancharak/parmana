import { describe, it, expect } from "vitest";
import { ReplayEngine } from "../src/ReplayEngine.js";

describe("Replay Determinism", () => {
  it("should produce identical output regardless of input order", () => {
    const engine = new ReplayEngine();

    const input1 = {
      transactions: [
        { id: "2", timestamp: 200, payload: "B" },
        { id: "1", timestamp: 100, payload: "A" },
      ],
    };

    const input2 = {
      transactions: [
        { id: "1", timestamp: 100, payload: "A" },
        { id: "2", timestamp: 200, payload: "B" },
      ],
    };

    expect(engine.replay(input1)).toEqual(engine.replay(input2));
  });
});
