import {
  ExecutionTrustRecordRepository,
  Receipt,
  ReceiptGenerationError,
  VerificationStatus,
} from "@parmana/shared";

/**
 * Application service responsible for generating
 * Execution Trust Receipts.
 *
 * Receipts are immutable cryptographic attestations
 * of verified Execution Trust Records.
 */
export class ReceiptService {
  constructor(
    private readonly trustRecords: ExecutionTrustRecordRepository
  ) {}

  /**
   * Generates a Receipt for the specified
   * Business Transaction.
   */
  async generate(
    businessTransactionId: string
  ): Promise<Receipt> {
    //
    // 1. Load Trust Record
    //
    const trustRecord =
      await this.trustRecords.findByTransactionId(
        businessTransactionId
      );

    if (!trustRecord) {
      throw new ReceiptGenerationError(
        "Execution Trust Record not found."
      );
    }

    //
    // 2. Ensure latest Verification succeeded
    //
    const latestVerification =
      trustRecord.verifications.at(-1);

    if (
      !latestVerification ||
      latestVerification.status !==
        VerificationStatus.VERIFIED
    ) {
      throw new ReceiptGenerationError(
        "Execution Trust Record must be successfully verified before a Receipt can be generated."
      );
    }

    //
    // 3. Generate cryptographic artifacts
    //
    // TODO(v0.5):
    // Replace with packages/crypto implementations.
    //
    const receiptHash =
      this.generateReceiptHash(trustRecord);

    const signature =
      this.signReceipt(receiptHash);

    //
    // 4. Create immutable Receipt
    //
    const receipt: Receipt = {
      receiptId: crypto.randomUUID(),

      businessTransactionId,

      trustRecordHash:
        trustRecord.trustRecordHash,

      receiptHash,

      signature,

      algorithm: "Ed25519",

      issuedAt: new Date(),
    };

    //
    // 5. Persist Receipt
    //
    await this.trustRecords.appendReceipt(
      businessTransactionId,
      receipt
    );

    return receipt;
  }

  /**
   * Temporary receipt hashing implementation.
   *
   * TODO(v0.5):
   * Delegate to TrustRecordHasher.
   */
  private generateReceiptHash(
    _trustRecord: unknown
  ): string {
    return "";
  }

  /**
   * Temporary signature implementation.
   *
   * TODO(v0.5):
   * Delegate to the signing provider.
   */
  private signReceipt(
    _receiptHash: string
  ): string {
    return "";
  }
}