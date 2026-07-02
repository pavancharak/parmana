import crypto from "node:crypto";

import {
  BusinessTransactionNotFoundError,
  BusinessTransactionRepository,
  Decision,
  Execution,
  ExecutionEvidence,
  ExecutionMode,
  ExecutionStatus,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

/**
 * Application service responsible for managing the
 * lifecycle of immutable Execution artifacts.
 *
 * Responsibilities:
 * - Create Execution artifacts.
 * - Attach Execution Evidence.
 * - Transition Execution lifecycle state.
 * - Persist Execution artifacts.
 *
 * ExecutionService does NOT:
 * - Evaluate policies.
 * - Execute enterprise business logic.
 * - Verify execution.
 * - Generate trust records.
 */
export class ExecutionService {
  constructor(
    private readonly transactions: BusinessTransactionRepository,
    private readonly trustRecords: ExecutionTrustRecordRepository,
  ) {
    Object.freeze(this);
  }

  /**
   * Creates the initial Execution artifact.
   */
  public async create(
    businessTransactionId: string,
    decision: Decision,
    mode: ExecutionMode,
  ): Promise<Execution> {
    const transaction =
      await this.transactions.findById(
        businessTransactionId,
      );

    if (!transaction) {
      throw new BusinessTransactionNotFoundError(
        businessTransactionId,
      );
    }

    const execution: Execution = {
      executionId: crypto.randomUUID(),

      businessTransactionId,

      decision,

      status: ExecutionStatus.PROCESSING,

      mode,

      startedAt: new Date(),
    };

    await this.trustRecords.appendExecution(
      businessTransactionId,
      execution,
    );

    return execution;
  }

  /**
   * Attaches immutable ExecutionEvidence to an
   * previously created Execution.
   */
  public async attachEvidence(
    execution: Execution,
    evidence: ExecutionEvidence,
  ): Promise<Execution> {
    const updated: Execution = {
      ...execution,
      evidence,
    };

    await this.trustRecords.replaceExecution(
      updated,
    );

    return updated;
  }

  /**
   * Marks an Execution as completed.
   */
  public async complete(
    execution: Execution,
  ): Promise<Execution> {
    const completed: Execution = {
      ...execution,

      status: ExecutionStatus.COMPLETED,

      completedAt: new Date(),
    };

    await this.trustRecords.replaceExecution(
      completed,
    );

    return completed;
  }

  /**
   * Marks an Execution as failed.
   */
  public async fail(
    execution: Execution,
  ): Promise<Execution> {
    const failed: Execution = {
      ...execution,

      status: ExecutionStatus.FAILED,

      completedAt: new Date(),
    };

    await this.trustRecords.replaceExecution(
      failed,
    );

    return failed;
  }
}