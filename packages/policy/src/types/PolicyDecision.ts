export type PolicyOutcome =
  | "APPROVE"
  | "REJECT"
  | "REQUIRE_OVERRIDE";

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