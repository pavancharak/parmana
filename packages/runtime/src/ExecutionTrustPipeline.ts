import { RuntimeContext } from "./context/RuntimeContext.js";

import { TrustChainBuilder } from "./TrustChainBuilder.js";

import { ReplayVerifier } from "@parmana/replay";

/**
 * Temporary pipeline result.
 *
 * This will be replaced by ExecutionTrustRecord after the
 * TrustChainBuilder is migrated to the canonical domain model.
 */
export interface PipelineResult {
  readonly execution: unknown;
  readonly proof: unknown;
  readonly trust: {
    readonly valid: boolean;
  };
}

/**
 * Execution Trust Pipeline.
 *
 * Orchestrates the current execution workflow while the
 * runtime is being migrated to the canonical Execution
 * Trust architecture.
 */
export class ExecutionTrustPipeline {
  private readonly builder = new TrustChainBuilder();

  private readonly verifier = new ReplayVerifier();

  /**
   * Execute the pipeline.
   */
  execute(
    context: RuntimeContext
  ): PipelineResult {
    const execution = this.run(context);

    const proof = this.builder.build({
      ...context,
      execution,
    });

    /**
     * TODO(v1):
     *
     * Replace self-verification with verification of the
     * reconstructed execution/trust record.
     */
    const replayCheck = this.verifier.verify(
      execution,
      execution
    );

    return {
      execution,
      proof,
      trust: {
        valid:
          replayCheck &&
          proof.verification.integrity,
      },
    };
  }

  /**
   * Temporary execution implementation.
   *
   * This will later delegate to the ExecutionStage.
   */
  private run(
    context: RuntimeContext
  ) {
    return {
      result: "executed",
      transaction: context.transaction,
    };
  }
}