import type { Verification } from "@parmana/shared";

import { VerificationPipeline } from "./VerificationPipeline.js";
import { VerificationContext } from "./context/VerificationContext.js";

/**
 * Parmana Verification Engine.
 *
 * The Verification Engine orchestrates the verification pipeline.
 * It contains no verification logic itself.
 */
export class VerificationEngine {
  /**
   * Verification execution context.
   */
  public readonly context: VerificationContext;

  /**
   * Verification pipeline.
   */
  public readonly pipeline: VerificationPipeline;

  constructor(
    pipeline: VerificationPipeline,
    context: VerificationContext = new VerificationContext(),
  ) {
    this.pipeline = pipeline;
    this.context = context;

    Object.freeze(this);
  }

  /**
   * Executes the verification pipeline.
   *
   * @param verification Immutable verification.
   * @returns Verified immutable verification.
   */
  public execute(verification: Verification): Verification {
    return this.pipeline.execute(verification);
  }

  /**
   * Returns true if no verification stages are configured.
   */
  public isEmpty(): boolean {
    return this.pipeline.isEmpty();
  }

  /**
   * Returns the number of configured verification stages.
   */
  public size(): number {
    return this.pipeline.size();
  }

  /**
   * Returns a JSON representation.
   */
  public toJSON() {
    return {
      context: this.context,
      stages: this.pipeline.size(),
    };
  }
}
