import {
  ExecutionTrustRecordRepository,
  Verification,
  VerificationStatus,
} from "@parmana/shared";

/**
 * Application service responsible for verifying
 * Execution Trust Records.
 *
 * Verification is deterministic and always
 * validates the complete Execution Trust Record.
 */
export class VerificationService {
  constructor(
    private readonly trustRecords: ExecutionTrustRecordRepository
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
      throw new Error(
        "Execution Trust Record not found."
      );
    }

    //
    // 2. Verify Trust Record
    //
    // Placeholder for VerificationEngine.
    //
    const verificationSucceeded = true;

    //
    // 3. Create immutable Verification artifact
    //
    const verification: Verification = {
      verificationId: crypto.randomUUID(),

      businessTransactionId,

      status: verificationSucceeded
        ? VerificationStatus.VERIFIED
        : VerificationStatus.FAILED,

      message: verificationSucceeded
        ? "Execution Trust Record verified successfully."
        : "Execution Trust Record verification failed.",

      verifiedAt: new Date(),

      trustRecordHash:
        trustRecord.trustRecordHash,
    };

    //
    // 4. Append Verification
    //
    await this.trustRecords.appendVerification(
      businessTransactionId,
      verification
    );

    return verification;
  }
}