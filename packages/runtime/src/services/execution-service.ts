import {
  BusinessTransactionNotFoundError,
  BusinessTransactionRepository,
  Decision,
  Execution,
  ExecutionMode,
  ExecutionStatus,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

/**
 * Application service responsible for creating
 * immutable Execution artifacts.
 *
 * ExecutionService does not evaluate policies or
 * construct Decisions. It records the execution of
 * an already-produced Decision.
 */
export class ExecutionService {
  constructor(
    private readonly transactions: BusinessTransactionRepository,
    private readonly trustRecords: ExecutionTrustRecordRepository,
  ) {}

  /**
   * Creates a new Execution.
   */
  async create(
    businessTransactionId: string,
    decision: Decision,
    mode: ExecutionMode,
  ): Promise<Execution> {
    //
    // Verify Business Transaction exists.
    //
    const transaction =
      await this.transactions.findById(businessTransactionId);

    if (!transaction) {
      throw new BusinessTransactionNotFoundError(
        businessTransactionId,
      );
    }

    const now = new Date();

    const execution: Execution = {
      executionId: crypto.randomUUID(),

      businessTransactionId,

      decision,

      status: ExecutionStatus.PROCESSING,

      mode,

      startedAt: now,
    };

    await this.trustRecords.appendExecution(
      businessTransactionId,
      execution,
    );

    return execution;
  }

  /**
   * Marks an Execution as completed.
   */
  async complete(
    execution: Execution,
  ): Promise<Execution> {
    const completed: Execution = {
      ...execution,

      status: ExecutionStatus.COMPLETED,

      completedAt: new Date(),
    };

    await this.trustRecords.replaceExecution(completed);

    return completed;
  }

  /**
   * Marks an Execution as failed.
   */
  async fail(
    execution: Execution,
  ): Promise<Execution> {
    const failed: Execution = {
      ...execution,

      status: ExecutionStatus.FAILED,

      completedAt: new Date(),
    };

    await this.trustRecords.replaceExecution(failed);

    return failed;
  }
}