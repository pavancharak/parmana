import {
  BusinessTransactionNotFoundError,
  BusinessTransactionRepository,
  Execution,
  ExecutionMode,
  ExecutionStatus,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

/**
 * Application service responsible for creating
 * immutable Execution artifacts.
 *
 * Business rules:
 * - Execution belongs to one Business Transaction.
 * - Executions are immutable.
 * - Executions are append-only.
 * - Multiple executions may exist.
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
    mode: ExecutionMode,
  ): Promise<Execution> {
    //
    // 1. Verify Business Transaction exists
    //
    const transaction = await this.transactions.findById(businessTransactionId);

    if (!transaction) {
      throw new BusinessTransactionNotFoundError(businessTransactionId);
    }

    //
    // 2. Create immutable Execution
    //
    const now = new Date();

    const execution: Execution = {
      executionId: crypto.randomUUID(),

      businessTransactionId,

      status: ExecutionStatus.PROCESSING,

      mode,

      startedAt: now,
    };

    //
    // 3. Append Execution to the Trust Record
    //
    await this.trustRecords.appendExecution(businessTransactionId, execution);

    return execution;
  }

  /**
   * Marks an Execution as completed.
   */
  async complete(execution: Execution): Promise<Execution> {
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
  async fail(execution: Execution): Promise<Execution> {
    const failed: Execution = {
      ...execution,

      status: ExecutionStatus.FAILED,

      completedAt: new Date(),
    };

    await this.trustRecords.replaceExecution(failed);

    return failed;
  }
}
