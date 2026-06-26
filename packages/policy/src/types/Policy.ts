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

export interface PolicyRule {
  id: string;
  condition: any;
  outcome: PolicyOutcome;
}

export interface Policy {
  policyId: string;
  policyVersion?: string;
  rules: PolicyRule[];
}
export interface PolicyCondition {
  signal?: string;
  greater_than?: number;
  equals?: any;

  all?: PolicyCondition[];
  any?: PolicyCondition[];
}