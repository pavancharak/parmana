import { describe, it, expect } from "vitest";
import { PolicyEngine } from "../src/PolicyEngine";

describe("PolicyEngine", () => {
  it("should evaluate policy", () => {
    const engine = new PolicyEngine();

    const result = engine.evaluate(
      {
        policyId: "test",
        rules: [
          {
            id: "r1",
            condition: { all: [] },
            outcome: {
              action: "approve",
              requiresOverride: false,
              reason: "ok"
            }
          }
        ]
      } as any,
      { amount: 100, currency: "INR", recipient: "abc" }
    );

    expect(result.action).toBe("approve");
  });
});