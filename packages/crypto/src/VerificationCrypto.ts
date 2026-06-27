import type { ExecutionTrustRecord } from "@parmana/shared";

import { TrustRecordHasher } from "./TrustRecordHasher.js";

import { CryptoBootstrap } from "./CryptoBootstrap.js";

/**
 * Verification cryptographic operations.
 */
export class VerificationCrypto {
  private readonly crypto = CryptoBootstrap.create();

  private readonly hasher = new TrustRecordHasher(this.crypto);

  /**
   * Creates the canonical immutable view of an
   * Execution Trust Record used for hashing.
   *
   * Mutable lifecycle evidence such as
   * Verifications and Receipts are intentionally
   * excluded so the Trust Record hash remains
   * stable throughout its lifetime.
   */
  private canonicalRecord(trustRecord: ExecutionTrustRecord) {
    return {
      trustRecordId: trustRecord.trustRecordId,

      businessTransactionId: trustRecord.businessTransactionId,

      transaction: trustRecord.transaction,

      overrides: trustRecord.overrides,

      executions: trustRecord.executions,

      createdAt: trustRecord.createdAt,
    };
  }

  /**
   * Computes the canonical Trust Record hash.
   */
  async hash(trustRecord: ExecutionTrustRecord): Promise<string> {
    return this.hasher.hash(this.canonicalRecord(trustRecord));
  }

  /**
   * Verifies that the Trust Record matches
   * the stored hash.
   */
  async verify(trustRecord: ExecutionTrustRecord): Promise<boolean> {
    const actual = await this.hash(trustRecord);

    return actual === trustRecord.trustRecordHash;
  }
}
