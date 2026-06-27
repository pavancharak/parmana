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
 * Coordinates the complete application workflow:
 *
 * 1. Accept the Business Transaction.
 * 2. Persist it.
 * 3. Execute it through the Runtime.
 * 4. Verify the resulting Execution Trust Record.
 * 5. Generate an Execution Trust Receipt.
 *
 * This class contains application orchestration only.
 * It contains no business rules.
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
   * Accepts and executes a Business Transaction.
   */
  async execute(
    transaction: BusinessTransaction,
  ): Promise<ExecutionTrustRecord> {
    await this.transactions.accept(transaction);

    return this.runtime.execute(transaction);
  }

  /**
   * Verifies an Execution Trust Record.
   */
  async verify(businessTransactionId: string): Promise<Verification> {
    return this.verification.verify(businessTransactionId);
  }

  /**
   * Generates a Receipt.
   */
  async generateReceipt(businessTransactionId: string): Promise<Receipt> {
    return this.receipts.generate(businessTransactionId);
  }

  /**
   * Replays an existing Execution Trust Record.
   *
   * Replay deterministically recomputes the Trust Record
   * hash and verifies its integrity without executing the
   * Business Transaction again.
   */
  async replay(businessTransactionId: string): Promise<{
    businessTransactionId: string;
    trustRecordHash: string;
    verified: boolean;
  }> {
    const trustRecord = await this.trustRecords.findByTransactionId(
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
   * Returns an Execution Trust Record.
   */
  async getTrustRecord(
    businessTransactionId: string,
  ): Promise<ExecutionTrustRecord | null> {
    return this.trustRecords.findByTransactionId(businessTransactionId);
  }

  /**
   * Returns a previously accepted
   * Business Transaction.
   */
  async getTransaction(
    businessTransactionId: string,
  ): Promise<BusinessTransaction | null> {
    return this.transactions.get(businessTransactionId);
  }

  /**
   * Lists accepted Business Transactions.
   */
  async listTransactions(
    page = 1,
    pageSize = 25,
  ): Promise<readonly BusinessTransaction[]> {
    return this.transactions.list(page, pageSize);
  }
}
