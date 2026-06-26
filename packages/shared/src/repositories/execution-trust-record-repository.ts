import {
  Execution,
  ExecutionTrustRecord,
  Override,
  Receipt,
  Verification,
} from "../domain/index.js";

export interface ExecutionTrustRecordRepository {

  create(
    record: ExecutionTrustRecord
  ): Promise<ExecutionTrustRecord>;

  findByTransactionId(
    businessTransactionId: string
  ): Promise<ExecutionTrustRecord | null>;

  appendExecution(
    businessTransactionId: string,
    execution: Execution
  ): Promise<void>;

  replaceExecution(
    execution: Execution
  ): Promise<void>;

  appendOverride(
    businessTransactionId: string,
    override: Override
  ): Promise<void>;

  appendVerification(
    businessTransactionId: string,
    verification: Verification
  ): Promise<void>;

  appendReceipt(
    businessTransactionId: string,
    receipt: Receipt
  ): Promise<void>;
}
