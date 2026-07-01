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
} from "./types/PolicyDecision.js";

import {
  PolicyAction,
} from "./types/PolicyAction.js";

import {
  PolicyOutcome,
} from "./types/PolicyOutcome.js";

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
  /**
   * Evaluates exactly one policy using the supplied runtime signals.
   */
  public evaluate(
    policy: Policy,
    signals: PolicySignals,
  ): PolicyDecision {
    const trace: string[] = [];

    const rule = this.findFirstMatch(
      policy.rules,
      signals,
      trace,
    );

    return {
      policyId: policy.policyId,

      policyVersion:
        policy.policyVersion ??
        "0.0.0",

      outcome: this.toOutcome(
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

      timestamp: Date.now(),
    };
  }

  /**
   * Maps a PolicyAction to the canonical PolicyOutcome.
   */
  private toOutcome(
    action?: PolicyAction,
  ): PolicyOutcome {
    switch (action) {
      case PolicyAction.APPROVE:
        return PolicyOutcome.APPROVE;

      case PolicyAction.REQUIRE_OVERRIDE:
        return PolicyOutcome.REQUIRE_OVERRIDE;

      case PolicyAction.REJECT:
      default:
        return PolicyOutcome.REJECT;
    }
  }

  /**
   * Returns the first matching policy rule.
   *
   * Policy evaluation is deterministic:
   * the first matching rule wins.
   */
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

  /**
   * Recursively evaluates a policy condition.
   */
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
    // Logical AND
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
    // Logical OR
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