import { describe, it, expect } from "vitest";
import { ReplayEngine } from "../src/ReplayEngine.js";
import { DecisionOutcome } from "@parmana/shared";

describe("Replay Determinism", () => {
  it("should produce identical output regardless of input order", () => {
    const engine = new ReplayEngine();

    const baseTrustRecord = {
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

    const input1 = {
      trustRecord: baseTrustRecord,
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

    const input2 = {
      trustRecord: baseTrustRecord,
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

    expect(engine.replay(input1)).toEqual(engine.replay(input2));
  });
});