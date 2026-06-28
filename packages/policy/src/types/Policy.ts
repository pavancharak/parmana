import type { JsonValue } from "@parmana/shared";

import type { PolicySignals } from "./PolicySignals.js";

/**
 * Canonical input to the PolicyEngine.
 *
 * A policy evaluates arbitrary runtime signals.
 */
export type PolicyInput = PolicySignals;

/**
 * Result produced by a policy rule.
 */
export interface PolicyOutcome {
  action: "approve" | "reject" | "override";
  reason: string;
  requiresOverride?: boolean;
}

/**
 * Policy condition.
 */
export interface PolicyCondition {
  /**
   * Signal to evaluate.
   */
  signal?: string;

  /**
   * Greater-than comparison.
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

/**
 * Single policy rule.
 */
export interface PolicyRule {
  /**
   * Rule identifier.
   */
  id: string;

  /**
   * Rule condition.
   */
  condition: PolicyCondition;

  /**
   * Rule outcome.
   */
  outcome: PolicyOutcome;
}

/**
 * Policy artifact.
 */
export interface Policy {
  /**
   * Unique policy identifier.
   */
  policyId: string;

  /**
   * Business policy version.
   */
  policyVersion: string;

  /**
   * Policy schema version.
   */
  schemaVersion: string;

  /**
   * Declares the runtime signals expected by this policy.
   *
   * Example:
   * {
   *   amount: "number",
   *   currency: "string",
   *   riskScore: "number"
   * }
   */
  signalsSchema: Record<string, string>;

  /**
   * Ordered evaluation rules.
   */
  rules: PolicyRule[];
}