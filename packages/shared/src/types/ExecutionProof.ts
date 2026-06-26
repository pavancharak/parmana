export interface ExecutionProof {
  executionId: string;
  decisionId: string;
  intentHash: string;
  executionHash: string;
  storageCommitment: string;
  timestamp: number;
  status: "SUCCESS" | "FAILED";
  verification: {
    integrity: boolean;
    authorization: boolean;
    replay: boolean;
  };
}
