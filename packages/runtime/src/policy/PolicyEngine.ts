export type PolicyAction = "approve" | "reject" | "override";

export interface PolicyOutcome {
  action: PolicyAction;
  reason: string;
}

export interface PolicyInput {
  amount: number;
  currency: string;
  recipient: string;
}

export interface PolicyRule {
  id: string;
  condition: {
    all?: any[];
  };
  outcome: PolicyOutcome;
}

export interface Policy {
  policyId: string;
  rules: PolicyRule[];
}

export class PolicyEngine {
  evaluate(policy: Policy, input: PolicyInput): PolicyOutcome {
    for (const rule of policy.rules) {
      if (this.matches(rule, input)) {
        return rule.outcome;
      }
    }

    return {
      action: "reject",
      reason: "no_rule_matched",
    };
  }

  private matches(rule: PolicyRule, input: PolicyInput): boolean {
    // VERY SIMPLE START (we improve later)
    if (!rule.condition.all) return true;

    for (const cond of rule.condition.all) {
      if (cond.greater_than !== undefined) {
        if (input.amount <= cond.greater_than) return false;
      }
    }

    return true;
  }
}