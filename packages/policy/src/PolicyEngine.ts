import {
  Policy,
  PolicyCondition,
  PolicyRule,
} from "./types/Policy.js";

import type {
  PolicySignals,
} from "./types/PolicySignals.js";

import type {
  PolicyDecision,
  PolicyOutcome,
} from "./types/PolicyDecision.js";

/**
 * Canonical Policy Engine.
 *
 * Responsibilities:
 * - Evaluate exactly one policy.
 * - Return a deterministic PolicyDecision.
 *
 * This engine does NOT:
 * - authorize execution
 * - execute actions
 * - generate runtime artifacts
 * - create trust records
 */
export class PolicyEngine {
  public evaluate(
    policy: Policy,
    signals: PolicySignals,
  ): PolicyDecision {
    const trace: string[] = [];

    const rule =
      this.findFirstMatch(
        policy.rules,
        signals,
        trace,
      );

    return {
      policyId: policy.policyId,

      policyVersion:
        policy.policyVersion ??
        "0.0.0",

      outcome:
        this.toOutcome(
          rule?.outcome.action,
        ),

      reason:
        rule?.outcome.reason ??
        "no_rule_matched",

      matchedRuleId:
        rule?.id ??
        "none",

      evaluatedRules:
        trace.length,

      matchedPath: trace,

      timestamp:
        Date.now(),
    };
  }

  private toOutcome(
    action?: string,
  ): PolicyOutcome {
    switch (action) {
      case "approve":
        return "APPROVE";

      case "require_override":
        return "REQUIRE_OVERRIDE";

      default:
        return "REJECT";
    }
  }

  private findFirstMatch(
    rules: PolicyRule[],
    signals: PolicySignals,
    trace: string[],
  ): PolicyRule | null {
    for (const rule of rules) {
      trace.push(rule.id);

      if (
        this.evaluateCondition(
          rule.condition,
          signals,
        )
      ) {
        return rule;
      }
    }

    return null;
  }

  private evaluateCondition(
    condition: PolicyCondition,
    signals: PolicySignals,
  ): boolean {
    if (!condition) {
      return false;
    }

    //
    // Leaf condition
    //
    if (condition.signal) {
      const value =
        signals[
          condition.signal
        ];

      if (
        value === undefined ||
        value === null
      ) {
        return false;
      }

      if (
        condition.greater_than !==
        undefined
      ) {
        if (
          typeof value !==
          "number"
        ) {
          return false;
        }

        return (
          value >
          condition.greater_than
        );
      }

      if (
        condition.equals !==
        undefined
      ) {
        return (
          value ===
          condition.equals
        );
      }

      return Boolean(value);
    }

    //
    // AND
    //
    if (
      Array.isArray(
        condition.all,
      )
    ) {
      return condition.all.every(
        (child) =>
          this.evaluateCondition(
            child,
            signals,
          ),
      );
    }

    //
    // OR
    //
    if (
      Array.isArray(
        condition.any,
      )
    ) {
      return condition.any.some(
        (child) =>
          this.evaluateCondition(
            child,
            signals,
          ),
      );
    }

    return false;
  }
}