import type { PolicyReference } from "./policy.js";

export interface Decision {
  readonly decisionId: string;
  readonly intentId: string;
  readonly policy: PolicyReference;
  readonly signals: Record<string, unknown>;
  readonly outcome: string;
  readonly reason: string;
  readonly evaluatedAt: Date;
}

export interface Execution {
  readonly executionId: string;
  readonly businessTransactionId: string;
  readonly decision: Decision;
  readonly status: string;
  readonly mode: string;
  readonly startedAt: Date;
}