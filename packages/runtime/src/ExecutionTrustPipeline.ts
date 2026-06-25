import { TrustChainBuilder } from "./TrustChainBuilder.js";

import { ReplayVerifier } from "@parmana/replay";

export class ExecutionTrustPipeline {
  private builder = new TrustChainBuilder();
  private verifier = new ReplayVerifier();

  execute(input: any) {
    const execution = this.run(input);

    const proof = this.builder.build({
      ...input,
      execution,
    });

    const replayCheck = this.verifier.verify(execution, execution);

    return {
      execution,
      proof,
      trust: {
        valid: replayCheck && proof.verification.integrity,
      },
    };
  }

  private run(input: any) {
    return {
      result: "executed",
      input,
    };
  }
}