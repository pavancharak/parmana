import {
  TrustRecordHasher,
} from "./TrustRecordHasher.js";

import {
  CryptoBootstrap,
} from "./CryptoBootstrap.js";

/**
 * Verification cryptographic operations.
 */
export class VerificationCrypto {

  private readonly crypto =
    CryptoBootstrap.create();

  private readonly hasher =
    new TrustRecordHasher(
      this.crypto
    );

  /**
   * Computes the canonical Trust Record hash.
   */
  async hash(
    trustRecord: unknown
  ): Promise<string> {

    return this.hasher.hash(
      trustRecord
    );

  }

  /**
   * Verifies that the Trust Record matches
   * the stored hash.
   */
  async verify(
    trustRecord: {
      trustRecordHash: string;
    }
  ): Promise<boolean> {

    const actual =
      await this.hash(
        trustRecord
      );

    return (
      actual ===
      trustRecord.trustRecordHash
    );

  }

}