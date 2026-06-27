import {
  ExecutionTrustRecordRepository,
  Verification,
  VerificationFailedError,
  VerificationStatus,
} from "@parmana/shared";

import {
  VerificationCrypto,
} from "@parmana/crypto";

/**
 * Application service responsible for verifying
 * Execution Trust Records.
 *
 * Verification is deterministic and validates
 * the complete Execution Trust Record.
 */
export class VerificationService {

  private readonly crypto =
    new VerificationCrypto();

  constructor(
    private readonly trustRecords:
      ExecutionTrustRecordRepository
  ) {}

  /**
   * Verifies an Execution Trust Record.
   */
  async verify(
    businessTransactionId: string
  ): Promise<Verification> {

    //
    // 1. Load Trust Record
    //
    const trustRecord =
      await this.trustRecords.findByTransactionId(
        businessTransactionId
      );

    if (!trustRecord) {
      throw new VerificationFailedError(
        "Execution Trust Record not found."
      );
    }

    //
    // 2. Verify Trust Record integrity
    //
    const verified =
      await this.crypto.verify(
        trustRecord
      );

    //
    // 3. Create immutable Verification
    //
    const verification: Verification = {

      verificationId:
        crypto.randomUUID(),

      businessTransactionId,

      status:
        verified
          ? VerificationStatus.VERIFIED
          : VerificationStatus.FAILED,

      message:
        verified
          ? "Execution Trust Record verified successfully."
          : "Execution Trust Record verification failed.",

      verifiedAt:
        new Date(),

      trustRecordHash:
        trustRecord.trustRecordHash,

    };

    //
    // 4. Persist Verification
    //
    await this.trustRecords.appendVerification(
      businessTransactionId,
      verification
    );

    return verification;

  }

}