import { ExecutionMode } from "@parmana/shared";

import { RuntimeContext } from "../context/RuntimeContext.js";
import type { RuntimeComponent } from "../RuntimeComponent.js";
import { ExecutionService } from "../services/execution-service.js";

/**
 * Execution Component.
 *
 * Runtime stage responsible for creating the
 * Execution artifact.
 */
export class ExecutionComponent implements RuntimeComponent {
  constructor(
    private readonly executionService: ExecutionService,
  ) {
    Object.freeze(this);
  }

  /**
   * Executes the Execution stage.
   */
  public async execute(
    context: RuntimeContext,
  ): Promise<RuntimeContext> {
    if (!context.decision) {
      throw new Error(
        "Decision must exist before Execution.",
      );
    }

    const execution = await this.executionService.create(
      context.transaction.businessTransactionId,
      context.decision,
      ExecutionMode.SYNC,
    );

    return {
      ...context,
      execution,
    };
  }
}