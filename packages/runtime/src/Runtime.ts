import type { ExecutionTransaction } from "@parmana/shared";

import { RuntimePipeline } from "./RuntimePipeline.js";
import { RuntimeContext } from "./context/RuntimeContext.js";

/**
 * Parmana Runtime.
 *
 * The Runtime is responsible only for orchestrating execution.
 * It delegates all work to the Runtime Pipeline.
 */
export class Runtime {
  /**
   * Runtime execution context.
   */
  public readonly context: RuntimeContext;

  /**
   * Runtime pipeline.
   */
  public readonly pipeline: RuntimePipeline;

  constructor(
    pipeline: RuntimePipeline,
    context: RuntimeContext = new RuntimeContext()
  ) {
    this.pipeline = pipeline;
    this.context = context;

    Object.freeze(this);
  }

  /**
   * Executes an immutable ExecutionTransaction through
   * the configured Runtime Pipeline.
   *
   * @param transaction Immutable execution transaction.
   * @returns The resulting immutable execution transaction.
   */
  public execute(
    transaction: ExecutionTransaction
  ): ExecutionTransaction {
    return this.pipeline.execute(transaction);
  }

  /**
   * Returns true if the Runtime has no configured stages.
   */
  public isEmpty(): boolean {
    return this.pipeline.isEmpty();
  }

  /**
   * Returns the number of configured Runtime stages.
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