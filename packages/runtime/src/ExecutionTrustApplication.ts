import { VerificationCrypto } from "@parmana/crypto";

import {
  BusinessTransaction,
  ExecutionTrustRecord,
  ExecutionTrustRecordRepository,
  Receipt,
  Verification,
} from "@parmana/shared";

import { Runtime } from "./Runtime.js";

import { BusinessTransactionService } from "./services/business-transaction-service.js";
import { ReceiptService } from "./services/receipt-service.js";
import { VerificationService } from "./services/verification-service.js";

/**
 * Execution Trust Application.
 *
 * Orchestrates the full lifecycle:
 * accept → execute → verify → receipt → replay
 */
export class ExecutionTrustApplication {
  private readonly crypto = new VerificationCrypto();

  constructor(
    private readonly transactions: BusinessTransactionService,
    private readonly runtime: Runtime,
    private readonly verification: VerificationService,
    private readonly receipts: ReceiptService,
    private readonly trustRecords: ExecutionTrustRecordRepository,
  ) {
    Object.freeze(this);
  }

  /**
   * Execute Business Transaction through Runtime
   */
  async execute(
  transaction: BusinessTransaction,
): Promise<ExecutionTrustRecord> {
  //
  // Accept the Business Transaction.
  //
  await this.transactions.accept(
    transaction,
  );

  //
  // Execute through the Runtime.
  //
  await this.runtime.execute(
    transaction,
  );

  //
  // Generate Verification.
  //
  await this.verification.verify(
    transaction.businessTransactionId,
  );

  //
  // Generate Receipt.
  //
  await this.receipts.generate(
    transaction.businessTransactionId,
  );

  //
  // Return the completed Execution Trust Record.
  //
  const trustRecord =
    await this.trustRecords.findByTransactionId(
      transaction.businessTransactionId,
    );

  if (!trustRecord) {
    throw new Error(
      "Execution Trust Record not found.",
    );
  }

  return trustRecord;
}

  /**
   * Verify Execution Trust Record
   */
  async verify(businessTransactionId: string): Promise<Verification> {
    return this.verification.verify(businessTransactionId);
  }

  /**
   * Generate Receipt
   */
  async generateReceipt(
    businessTransactionId: string,
  ): Promise<Receipt> {
    return this.receipts.generate(businessTransactionId);
  }

  /**
   * Replay execution deterministically
   */
  async replay(businessTransactionId: string): Promise<{
    businessTransactionId: string;
    trustRecordHash: string;
    verified: boolean;
  }> {
    const trustRecord =
      await this.trustRecords.findByTransactionId(
        businessTransactionId,
      );

    if (!trustRecord) {
      throw new Error("Execution Trust Record not found.");
    }

    const verified = await this.crypto.verify(trustRecord);

    return {
      businessTransactionId,
      trustRecordHash: trustRecord.trustRecordHash,
      verified,
    };
  }

  /**
   * Get Trust Record
   */
  async getTrustRecord(
    businessTransactionId: string,
  ): Promise<ExecutionTrustRecord | null> {
    return this.trustRecords.findByTransactionId(businessTransactionId);
  }

  /**
   * Get Transaction
   */
  async getTransaction(
    businessTransactionId: string,
  ): Promise<BusinessTransaction | null> {
    return this.transactions.get(businessTransactionId);
  }

  /**
   * List Transactions
   */
  async listTransactions(
    page = 1,
    pageSize = 25,
  ): Promise<readonly BusinessTransaction[]> {
    return this.transactions.list(page, pageSize);
  }
}