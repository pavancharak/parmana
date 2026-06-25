export interface Verification {
  id: string;

  executionId: string;
  decisionId: string;

  stage:
    | "AUTHORITY"
    | "AUTHORIZATION"
    | "INTENT"
    | "INTEGRITY"
    | "EVIDENCE"
    | "SIGNATURE";

  status: "PASS" | "FAIL";

  timestamp: number;

  metadata?: Record<string, unknown>;
}