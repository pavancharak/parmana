import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PolicyOutcome,
  PolicyEngine,
  PolicyValidator,
  type Policy,
  type PolicySignals,
} from "../../../packages/policy/src/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));

function load(example: string): Policy {
  const file = path.join(here, "..", example, "policy.json");
  return JSON.parse(readFileSync(file, "utf8")) as Policy;
}

const merge = load("github-pr-merge");
const refund = load("customer-refund-sourced");

/**
 * The facts a request is decided on. In production each sourced fact comes
 * from the source's signed answer (Trusted Signal), and each approval fact
 * from the signed approval. These tests supply the trusted values directly,
 * to check the policy's rules.
 */
function mergeSignals(
  changes: Partial<Record<keyof typeof mergeFacts, boolean>> = {},
): PolicySignals {
  return { ...mergeFacts, ...changes };
}

const mergeFacts = {
  mergeApproved: true,
  repositoryAuthorized: true,
  statusChecksPassed: true,
  requiredReviewsCompleted: true,
  branchProtected: true,
};

function refundSignals(
  changes: Partial<{
    managerApproved: boolean;
    refundAmount: number;
    refundEligible: boolean;
    fraudCheckPassed: boolean;
  }> = {},
): PolicySignals {
  return {
    managerApproved: true,
    refundAmount: 500,
    refundEligible: true,
    fraudCheckPassed: true,
    ...changes,
  };
}

describe("example policies pass the policy validator", () => {
  it("accepts github-pr-merge-sourced", () => {
    expect(() => new PolicyValidator().validate(merge)).not.toThrow();
  });

  it("accepts customer-refund-sourced", () => {
    expect(() => new PolicyValidator().validate(refund)).not.toThrow();
  });
});

describe("github-pr-merge-sourced", () => {
  const engine = new PolicyEngine();

  it("approves a merge with a signed approval and GitHub reporting it ready", () => {
    const decision = engine.evaluate(merge, mergeSignals());
    expect(decision.outcome).toBe(PolicyOutcome.APPROVE);
    expect(decision.matchedRuleId).toBe("approve-merge-with-signed-approval");
  });

  it.each([
    ["statusChecksPassed", "reject-checks-not-passed"],
    ["requiredReviewsCompleted", "reject-reviews-incomplete"],
    ["branchProtected", "reject-branch-not-protected"],
    ["repositoryAuthorized", "reject-repository-not-authorized"],
  ])("refuses when %s is false, even with a signed approval", (fact, rule) => {
    const decision = engine.evaluate(
      merge,
      mergeSignals({ [fact]: false } as Partial<
        Record<keyof typeof mergeFacts, boolean>
      >),
    );
    expect(decision.outcome).toBe(PolicyOutcome.REJECT);
    expect(decision.matchedRuleId).toBe(rule);
  });

  it("refuses without a signed approval, even when GitHub reports it ready", () => {
    const decision = engine.evaluate(
      merge,
      mergeSignals({ mergeApproved: false }),
    );
    expect(decision.outcome).toBe(PolicyOutcome.REJECT);
    expect(decision.matchedRuleId).toBe("reject-merge-approval-required");
  });
});

describe("customer-refund-sourced", () => {
  const engine = new PolicyEngine();

  it("approves a refund with a signed manager approval and both systems confirming", () => {
    const decision = engine.evaluate(refund, refundSignals());
    expect(decision.outcome).toBe(PolicyOutcome.APPROVE);
    expect(decision.matchedRuleId).toBe("approve-refund-with-manager-approval");
  });

  it("refuses when the order system says the order is not eligible", () => {
    const decision = engine.evaluate(
      refund,
      refundSignals({ refundEligible: false }),
    );
    expect(decision.outcome).toBe(PolicyOutcome.REJECT);
    expect(decision.matchedRuleId).toBe("reject-not-eligible");
  });

  it("refuses when the fraud system says the payment did not pass", () => {
    const decision = engine.evaluate(
      refund,
      refundSignals({ fraudCheckPassed: false }),
    );
    expect(decision.outcome).toBe(PolicyOutcome.REJECT);
    expect(decision.matchedRuleId).toBe("reject-fraud-check");
  });

  it("refuses above 100000, even with a manager approval", () => {
    const decision = engine.evaluate(
      refund,
      refundSignals({ refundAmount: 100001 }),
    );
    expect(decision.outcome).toBe(PolicyOutcome.REJECT);
    expect(decision.matchedRuleId).toBe("reject-above-maximum");
  });

  it("refuses without a manager approval, even when both systems confirm", () => {
    const decision = engine.evaluate(
      refund,
      refundSignals({ managerApproved: false }),
    );
    expect(decision.outcome).toBe(PolicyOutcome.REJECT);
    expect(decision.matchedRuleId).toBe("reject-manager-approval-required");
  });
});
