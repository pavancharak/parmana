import {
  BusinessTransaction,
  ExecutionTrustRecord,
} from "@parmana/shared";

import { RuntimePipeline } from "./RuntimePipeline.js";
import { RuntimeContext } from "./context/RuntimeContext.js";
import { ExecutionTrustPipeline } from "./ExecutionTrustPipeline.js";

/**
 * Parmana Runtime.
 *
 * Executes Business Transactions through the
 * configured Runtime Pipeline.
 */
export class Runtime {
  private readonly trustPipeline =
    new ExecutionTrustPipeline();

  constructor(
    private readonly pipeline: RuntimePipeline
  ) {
    Object.freeze(this);
  }

  /**
   * Executes a Business Transaction.
   */
  public async execute(
    transaction: BusinessTransaction
  ): Promise<ExecutionTrustRecord> {

    let context: RuntimeContext = {
      transaction,
    };

    context =
      await this.pipeline.execute(context);

    return this.trustPipeline.execute(
      context
    );
  }

  /**
   * Returns true if no runtime stages exist.
   */
  public isEmpty(): boolean {
    return this.pipeline.isEmpty();
  }

  /**
   * Returns the number of runtime stages.
   */
  public size(): number {
    return this.pipeline.size();
  }
}