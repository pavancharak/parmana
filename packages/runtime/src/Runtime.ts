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
 * The Runtime orchestrates execution by:
 *
 *   BusinessTransaction
 *          │
 *          ▼
 *   RuntimePipeline
 *          │
 *          ▼
 *   ExecutionTrustPipeline
 *          │
 *          ▼
 *   ExecutionTrustRecord
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
  public execute(
    transaction: BusinessTransaction
  ): ExecutionTrustRecord {

    const context: RuntimeContext = {
      transaction,
    };

    const updatedContext =
      this.pipeline.execute(context);

    return this.trustPipeline.execute(
      updatedContext
    );
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
}