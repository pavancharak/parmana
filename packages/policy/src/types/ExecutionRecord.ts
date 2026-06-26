export type ExecutionRecord = {
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

  hash: string;

  timestamp: number;
};