import {
  ExecutionTrustRecordRepository,
  Receipt,
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
      throw new Error(
        "Execution Trust Record not found."
      );
    }

    //
    // 2. Verify latest Verification succeeded
    //
    const latestVerification =
      trustRecord.verifications.at(-1);

    if (
      !latestVerification ||
      latestVerification.status !== VerificationStatus.VERIFIED
    ) {
      throw new Error(
        "Execution Trust Record must be successfully verified before a Receipt can be generated."
      );
    }

    //
    // 3. Delegate hashing & signing
    //
    // Placeholder:
    //
    // const receiptHash = await receiptHasher.hash(trustRecord);
    // const signature = await signer.sign(receiptHash);
    //
    const receiptHash = "";
    const signature = "";

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
    // 5. Append Receipt
    //
    await this.trustRecords.appendReceipt(
      businessTransactionId,
      receipt
    );

    return receipt;
  }
}