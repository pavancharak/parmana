import { PolicyOutcome } from "./PolicyOutcome.js";

/**
 * Immutable result returned by PolicyEngine.
 */
export interface PolicyDecision {
  policyId: string;

  policyVersion: string;

  outcome: PolicyOutcome;

  reason: string;

  matchedRuleId: string;

  evaluatedRules: number;

  matchedPath: string[];

  timestamp: number;
}