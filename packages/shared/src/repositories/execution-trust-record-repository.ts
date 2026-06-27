import {
  Execution,
  ExecutionTrustRecord,
  Override,
  Receipt,
  Verification,
} from "../domain/index.js";

/**
 * Repository for immutable
 * Execution Trust Records.
 */
export interface ExecutionTrustRecordRepository {
  create(record: ExecutionTrustRecord): Promise<ExecutionTrustRecord>;

  findByTransactionId(
    businessTransactionId: string,
  ): Promise<ExecutionTrustRecord | null>;

  /**
   * Appends a new immutable Execution.
   */
  appendExecution(
    businessTransactionId: string,
    execution: Execution,
  ): Promise<void>;

  /**
   * @deprecated
   *
   * Parmana uses an append-only execution model.
   *
   * Execution state transitions must be represented
   * by appending a new immutable Execution using
   * appendExecution().
   *
   * This method exists only for backward
   * compatibility and should not be used in new
   * implementations.
   */
  replaceExecution(execution: Execution): Promise<void>;

  /**
   * Appends an immutable Override.
   */
  appendOverride(
    businessTransactionId: string,
    override: Override,
  ): Promise<void>;

  /**
   * Appends an immutable Verification.
   */
  appendVerification(
    businessTransactionId: string,
    verification: Verification,
  ): Promise<void>;

  /**
   * Appends an immutable Receipt.
   */
  appendReceipt(businessTransactionId: string, receipt: Receipt): Promise<void>;
}
