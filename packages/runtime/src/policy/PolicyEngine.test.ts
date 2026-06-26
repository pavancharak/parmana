import { describe, it, expect } from "vitest";
import { PolicyEngine } from "./PolicyEngine.js";

const policy = {
  policyId: "payment-release",
  policyVersion: "1.0.0",
  signalsSchema: {},
  rules: [
    {
      id: "approve",
      condition: {
        all: [{ signal: "amount", greater_than: 0 }],
      },
      outcome: {
        action: "approve",
        requires_override: false,
        reason: "ok",
      },
    },
  ],
};

describe("PolicyEngine", () => {
  it("approves valid input", () => {
    const engine = new PolicyEngine();

    const result = engine.evaluate(policy as any, {
      amount: 100,
currency: "USD",
recipient: "test",
    });

    expect(result.action).toBe("approve");
  });
});