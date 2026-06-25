import { createHash } from "crypto";
import type { ExecutionProof } from "@parmana/shared";

export class TrustChainBuilder {
  build(input: any): ExecutionProof {
    const intentHash = this.hash(input.intent);
    const executionHash = this.hash(JSON.stringify(input.execution));

    const storageCommitment = this.hash(
      intentHash + executionHash + input.executionId
    );

    return {
      executionId: input.executionId,
      decisionId: input.decisionId,
      intentHash,
      executionHash,
      storageCommitment,
      timestamp: Date.now(),
      status: "SUCCESS",
      verification: {
        integrity: true,
        authorization: true,
        replay: true,
      },
    };
  }

  private hash(data: string): string {
    return createHash("sha256").update(data).digest("hex");
  }
}