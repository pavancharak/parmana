export type LedgerEntry = {
  executionId: string;

  policyId: string;
  policyVersion: string;

  input: any;

  matchedRuleId: string;
  action: "approve" | "reject" | "override";
  reason: string;

  trace: {
    evaluatedRules: number;
    matchedPath: string[];
  };

  timestamp: number;

  hash: string;
};