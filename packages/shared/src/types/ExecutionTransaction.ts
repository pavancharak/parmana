import type { ExecutionStatus } from "./ExecutionStatus.js";

export interface ExecutionTransaction {
  id: string;

  decisionId: string;
  executionId: string;

  intent: unknown;
  authority: unknown;
  authorization: unknown;
  evidence: unknown;

  execution: {
    status: ExecutionStatus;
    result?: unknown;
  };

  timestamp: number;
}
