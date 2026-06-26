import {
  Execution,
  ExecutionTrustRecord,
  ExecutionTrustRecordRepository,
  Override,
  Receipt,
  Verification,
} from "@parmana/shared";

/**
 * In-memory Execution Trust Record repository.
 *
 * All updates preserve the immutable domain model by
 * replacing the stored Execution Trust Record rather
 * than mutating it.
 */
export class MemoryExecutionTrustRecordRepository
  implements ExecutionTrustRecordRepository {

  private readonly records =
    new Map<string, ExecutionTrustRecord>();

  async create(
    record: ExecutionTrustRecord
  ): Promise<ExecutionTrustRecord> {

    this.records.set(
      record.businessTransactionId,
      record
    );

    return record;
  }

  async findByTransactionId(
    businessTransactionId: string
  ): Promise<ExecutionTrustRecord | null> {

    return (
      this.records.get(
        businessTransactionId
      ) ?? null
    );
  }

  async appendExecution(
    businessTransactionId: string,
    execution: Execution
  ): Promise<void> {

    const record =
      this.records.get(
        businessTransactionId
      );

    if (!record) {
      return;
    }

    const updated: ExecutionTrustRecord = {
      ...record,
      executions: [
        ...record.executions,
        execution,
      ],
    };

    this.records.set(
      businessTransactionId,
      updated
    );
  }

  async replaceExecution(
    execution: Execution
  ): Promise<void> {

    const record =
      this.records.get(
        execution.businessTransactionId
      );

    if (!record) {
      return;
    }

    const updated: ExecutionTrustRecord = {
      ...record,
      executions: record.executions.map(
        existing =>
          existing.executionId ===
          execution.executionId
            ? execution
            : existing
      ),
    };

    this.records.set(
      execution.businessTransactionId,
      updated
    );
  }

  async appendOverride(
    businessTransactionId: string,
    overrideArtifact: Override
  ): Promise<void> {

    const record =
      this.records.get(
        businessTransactionId
      );

    if (!record) {
      return;
    }

    const updated: ExecutionTrustRecord = {
      ...record,
      overrides: [
        ...record.overrides,
        overrideArtifact,
      ],
    };

    this.records.set(
      businessTransactionId,
      updated
    );
  }

  async appendVerification(
    businessTransactionId: string,
    verification: Verification
  ): Promise<void> {

    const record =
      this.records.get(
        businessTransactionId
      );

    if (!record) {
      return;
    }

    const updated: ExecutionTrustRecord = {
      ...record,
      verifications: [
        ...record.verifications,
        verification,
      ],
    };

    this.records.set(
      businessTransactionId,
      updated
    );
  }

  async appendReceipt(
    businessTransactionId: string,
    receipt: Receipt
  ): Promise<void> {

    const record =
      this.records.get(
        businessTransactionId
      );

    if (!record) {
      return;
    }

    const updated: ExecutionTrustRecord = {
      ...record,
      receipts: [
        ...record.receipts,
        receipt,
      ],
    };

    this.records.set(
      businessTransactionId,
      updated
    );
  }
}