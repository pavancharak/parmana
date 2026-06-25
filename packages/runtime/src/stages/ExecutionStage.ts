import type { ExecutionTransaction } from "@parmana/shared";

export class ExecutionStage {
  execute(transaction: ExecutionTransaction): ExecutionTransaction {
    const execution = transaction.execution;

    if (!execution) {
      throw new Error("Missing execution block");
    }

    if (execution.status === "FAILED") {
      throw new Error(
        `Execution failed previously: ${execution.result ?? "unknown"}`
      );
    }

    if (execution.status === "AUTHORIZED" || execution.status === "PENDING") {
      return {
        ...transaction,
        execution: {
          status: "SUCCEEDED",
          result: {
            executedAt: Date.now(),
            stage: "ExecutionStage",
          },
        },
      };
    }

    if (execution.status === "SUCCEEDED") {
      return transaction;
    }

    throw new Error(`Invalid execution status: ${execution.status}`);
  }
}