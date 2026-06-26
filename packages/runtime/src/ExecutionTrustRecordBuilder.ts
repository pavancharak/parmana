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
  /**
   * Builds an immutable Execution Trust Record
   * from the current RuntimeContext.
   */
  build(
    context: RuntimeContext
  ): ExecutionTrustRecord {

    if (!context.execution) {
      throw new Error(
        "Execution artifact is required."
      );
    }

    return {
      trustRecordId: crypto.randomUUID(),

      businessTransactionId:
        context.transaction.businessTransactionId,

      transaction: context.transaction,

      overrides: context.override
        ? [context.override]
        : [],

      executions: [
        context.execution,
      ],

      verifications: context.verification
        ? [context.verification]
        : [],

      receipts: context.receipt
        ? [context.receipt]
        : [],

      /**
       * Placeholder.
       *
       * Will be computed by the
       * TrustRecordHasher in packages/crypto.
       */
      /**
 * TODO(v0.4):
 * Compute canonical SHA-256 hash using
 * packages/crypto/TrustRecordHasher.
 */
trustRecordHash: "",

      createdAt: new Date(),

      updatedAt: new Date(),
    };
  }
}