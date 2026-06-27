import {
  VerificationCrypto,
} from "@parmana/crypto";

import {
  ExecutionTrustRecord,
} from "@parmana/shared";

import { RuntimeContext } from "./context/RuntimeContext.js";

/**
 * Builds the canonical Execution Trust Record.
 *
 * This builder is the successor to TrustChainBuilder.
 * During migration both builders coexist.
 */
export class ExecutionTrustRecordBuilder {

  private readonly crypto =
    new VerificationCrypto();

  /**
   * Builds an immutable Execution Trust Record
   * from the current RuntimeContext.
   */
  async build(
    context: RuntimeContext
  ): Promise<ExecutionTrustRecord> {

    if (!context.execution) {
      throw new Error(
        "Execution artifact is required."
      );
    }

    //
    // Build the record without its hash.
    //
    const record: ExecutionTrustRecord = {

      trustRecordId:
        crypto.randomUUID(),

      businessTransactionId:
        context.transaction.businessTransactionId,

      transaction:
        context.transaction,

      overrides:
        context.override
          ? [context.override]
          : [],

      executions: [
        context.execution,
      ],

      verifications:
        context.verification
          ? [context.verification]
          : [],

      receipts:
        context.receipt
          ? [context.receipt]
          : [],

      trustRecordHash: "",

      createdAt:
        new Date(),

      updatedAt:
        new Date(),

    };

    //
    // Compute canonical Trust Record hash.
    //
    const trustRecordHash =
      await this.crypto.hash(
        record
      );

    //
    // Return immutable record
    // with computed hash.
    //
    return {

      ...record,

      trustRecordHash,

    };

  }

}