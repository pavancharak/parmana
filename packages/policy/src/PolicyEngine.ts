import { Policy, PolicyCondition } from "./types/Policy.js";

export type PolicyDecision = {
  policyId: string;
  policyVersion: string;
  matchedRuleId: string;
  action: "approve" | "reject" | "override";
  requiresOverride: boolean;
  reason: string;
};

export class PolicyEngine {
  evaluate(policy: Policy, signals: any): PolicyDecision {
    const rule = this.findFirstMatch(policy.rules, signals);

    if (rule) {
      return {
        policyId: policy.policyId,
        policyVersion: policy.policyVersion ?? "0.0.0",
        matchedRuleId: rule.id,
        action: rule.outcome.action,
        requiresOverride: rule.outcome.requiresOverride ?? false,
        reason: rule.outcome.reason,
      };
    }

    const fallback = policy.rules.find(r => r.id.includes("catch-all"));

    return {
      policyId: policy.policyId,
      policyVersion: policy.policyVersion ?? "0.0.0",
      matchedRuleId: fallback?.id ?? "none",
      action: "reject",
      requiresOverride: true,
      reason: "no_rule_matched",
    };
  }

  private findFirstMatch(rules: any[], signals: any) {
    for (const rule of rules) {
      if (this.evaluateCondition(rule.condition, signals)) {
        return rule;
      }
    }
    return null;
  }

  private evaluateCondition(condition: PolicyCondition, signals: any): boolean {
    if (!condition) return false;

    // CASE 1: leaf condition (signal-based)
    if ("signal" in condition) {
      const signalKey = condition.signal;
      if (!signalKey) return false;

      const value = signals?.[signalKey];

      if (condition.greater_than !== undefined) {
        return value > condition.greater_than;
      }

      if (condition.equals !== undefined) {
        return value === condition.equals;
      }

      return Boolean(value);
    }

    // CASE 2: AND conditions
    if (condition.all && condition.all.length > 0) {
      return condition.all.every((c) =>
        this.evaluateCondition(c as PolicyCondition, signals)
      );
    }

    // CASE 3: OR conditions
    if (condition.any && condition.any.length > 0) {
      return condition.any.some((c) =>
        this.evaluateCondition(c as PolicyCondition, signals)
      );
    }

    return false;
  }
}