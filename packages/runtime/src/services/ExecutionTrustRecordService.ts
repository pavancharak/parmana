import { createHash, randomUUID } from "crypto";

import {
  BusinessTransaction,
  Execution,
  ExecutionTrustRecord,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

export interface ExecutionTrustRecordServiceInput {
  readonly transaction: BusinessTransaction;
  readonly execution: Execution;
}

/**
 * ExecutionTrustRecordService
 *
 * Responsible for:
 * 1. Creating ExecutionTrustRecord (immutable)
 * 2. Persisting it via repository (required for replay/verification)
 */
export class ExecutionTrustRecordService {
  constructor(
    private readonly repository: ExecutionTrustRecordRepository,
  ) {}

  /**
   * Creates a deterministic ExecutionTrustRecord
   */
  create(
    input: ExecutionTrustRecordServiceInput,
  ): ExecutionTrustRecord {
    const now = new Date();

    const trustRecord: Omit<
      ExecutionTrustRecord,
      "trustRecordHash"
    > = {
      trustRecordId: randomUUID(),

      businessTransactionId:
        input.transaction.businessTransactionId,

      transaction: input.transaction,

      overrides: [],

      executions: [input.execution],

      verifications: [],

      receipts: [],

      createdAt: now,

      updatedAt: now,
    };

    return {
      ...trustRecord,
      trustRecordHash: this.computeHash(trustRecord),
    };
  }

  /**
   * Persists ExecutionTrustRecord for replay/verification
   */
  async save(record: ExecutionTrustRecord): Promise<void> {
    await this.repository.create(record);
  }

  /**
   * Deterministic hash computation for integrity
   */
  private computeHash(
    record: Omit<ExecutionTrustRecord, "trustRecordHash">,
  ): string {
    return createHash("sha256")
      .update(JSON.stringify(record))
      .digest("hex");
  }
}