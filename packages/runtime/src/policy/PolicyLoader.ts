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
  policyVersion?: string;
  rules: PolicyRule[];
}

export class PolicyEngine {
  evaluate(policy: Policy, input: PolicyInput): PolicyOutcome {
    if (!policy?.rules) {
      return {
        action: "reject",
        reason: "invalid_policy",
      };
    }

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
    if (!rule.condition?.all || rule.condition.all.length === 0) {
      return true;
    }

    for (const cond of rule.condition.all) {
      if (cond.greater_than !== undefined) {
        if (input.amount <= cond.greater_than) return false;
      }

      if (cond.equals !== undefined) {
        const keys = Object.keys(cond.equals);

if (keys.length === 0) return false;

const key = keys[0] as keyof PolicyInput;

if ((input as any)[key] !== (cond.equals as any)[key]) return false;
      }
    }

    return true;
  }
}