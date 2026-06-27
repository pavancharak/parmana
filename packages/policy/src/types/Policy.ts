import type { JsonValue } from "@parmana/shared";

export interface PolicyInput {
  amount: number;
  currency: string;
  recipient: string;
}

export interface PolicyOutcome {
  action: "approve" | "reject" | "override";
  reason: string;
  requiresOverride?: boolean;
}

export interface PolicyCondition {
  /**
   * Signal to evaluate.
   *
   * Example:
   * "amount"
   * "currency"
   * "riskScore"
   */
  signal?: string;

  /**
   * Numeric comparison.
   */
  greater_than?: number;

  /**
   * Equality comparison.
   */
  equals?: JsonValue;

  /**
   * Logical AND.
   */
  all?: PolicyCondition[];

  /**
   * Logical OR.
   */
  any?: PolicyCondition[];
}

export interface PolicyRule {
  id: string;

  condition: PolicyCondition;

  outcome: PolicyOutcome;
}

export interface Policy {
  policyId: string;

  policyVersion?: string;

  rules: PolicyRule[];
}
