import type { PolicySignals } from "./PolicySignals.js";

export interface LedgerEntry {
  executionId: string;

  policyId: string;
  policyVersion: string;

  input: PolicySignals;

  matchedRuleId: string;

  action: "approve" | "reject" | "override";

  reason: string;

  trace: {
    evaluatedRules: number;
    matchedPath: string[];
  };

  timestamp: number;

  hash: string;
}
