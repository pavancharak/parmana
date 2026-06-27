import { Policy, PolicyCondition, PolicyRule } from "./types/Policy.js";

import type { PolicySignals } from "./types/PolicySignals.js";

import { LedgerEntry } from "./types/LedgerEntry.js";

import { hashLedger } from "./utils/hash.js";

export class PolicyEngine {
  evaluate(policy: Policy, signals: PolicySignals): LedgerEntry {
    const trace: string[] = [];

    const rule = this.findFirstMatch(policy.rules, signals, trace);

    const base = {
      executionId: crypto.randomUUID(),

      policyId: policy.policyId,

      policyVersion: policy.policyVersion ?? "0.0.0",

      input: signals,

      matchedRuleId: rule?.id ?? "none",

      action: rule?.outcome.action ?? "reject",

      reason: rule?.outcome.reason ?? "no_rule_matched",

      trace: {
        evaluatedRules: trace.length,

        matchedPath: trace,
      },

      timestamp: Date.now(),
    };

    return {
      ...base,

      hash: hashLedger(base),
    };
  }

  private findFirstMatch(
    rules: PolicyRule[],
    signals: PolicySignals,
    trace: string[],
  ): PolicyRule | null {
    for (const rule of rules) {
      trace.push(rule.id);

      if (this.evaluateCondition(rule.condition, signals)) {
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
      const value = signals[condition.signal];

      if (value === undefined || value === null) {
        return false;
      }

      if (condition.greater_than !== undefined) {
        if (typeof value !== "number") {
          return false;
        }

        return value > condition.greater_than;
      }

      if (condition.equals !== undefined) {
        return value === condition.equals;
      }

      return Boolean(value);
    }

    //
    // AND
    //
    if (Array.isArray(condition.all)) {
      return condition.all.every((child) =>
        this.evaluateCondition(child, signals),
      );
    }

    //
    // OR
    //
    if (Array.isArray(condition.any)) {
      return condition.any.some((child) =>
        this.evaluateCondition(child, signals),
      );
    }

    return false;
  }
}
