import { describe, it, expect } from "vitest";
import { ReplayEngine } from "../src/ReplayEngine.js";
import { DecisionOutcome } from "@parmana/shared";

describe("ReplayEngine - Deterministic Execution", () => {
  it("should produce identical replay results", () => {
    const engine = new ReplayEngine();

    const trustRecord = {
      executions: [
        {
          decision: {
            decisionId: "d1",
            intentId: "i1",
            policy: {
              rules: [
                {
                  id: "r1",
                  condition: "riskScore > 50",
                  action: "reject",
                },
              ],
            },
            signals: {},
            outcome: DecisionOutcome.APPROVED,
            reason: "ok",
            evaluatedAt: new Date(),
          },
        },
      ],
    };

    const input = {
      trustRecord,
      transaction: {
        signals: {},
      },
      policy: {
        rules: [
          {
            id: "r1",
            condition: "riskScore > 50",
            action: "reject",
          },
        ],
      },
    };

    const r1 = engine.replay(input);
    const r2 = engine.replay(input);

    expect(r1).toEqual(r2);
  });

  it("should preserve execution order", () => {
    const engine = new ReplayEngine();

    const trustRecord = {
      executions: [
        {
          decision: {
            decisionId: "d1",
            intentId: "i1",
            policy: {
              rules: [
                {
                  id: "r1",
                  condition: "riskScore > 50",
                  action: "approve",
                },
              ],
            },
            signals: {},
            outcome: DecisionOutcome.APPROVED,
            reason: "ok",
            evaluatedAt: new Date(),
          },
        },
      ],
    };

    const input = {
      trustRecord,
      transaction: {
        signals: {},
      },
      policy: {
        rules: [
          {
            id: "r1",
            condition: "riskScore > 50",
            action: "approve",
          },
        ],
      },
    };

    const result = engine.replay(input);

    expect(result.recordedDecision.intentId).toBe("i1");
  });
});