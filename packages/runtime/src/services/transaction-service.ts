import {
  BusinessTransaction,
  BusinessTransactionRepository,
  ExecutionTrustRecord,
  ExecutionTrustRecordRepository,
  PolicyRepository,
} from "@parmana/shared";

/**
 * Application service responsible for creating
 * Business Transactions.
 *
 * This service orchestrates the workflow but does
 * not implement persistence.
 */
export class TransactionService {
  constructor(
    private readonly transactions: BusinessTransactionRepository,
    private readonly trustRecords: ExecutionTrustRecordRepository,
    private readonly policies: PolicyRepository,
  ) {}

  /**
   * Creates a Business Transaction.
   */
  async create(transaction: BusinessTransaction): Promise<BusinessTransaction> {
    //
    // 1. Idempotency
    //
    const existing = await this.transactions.findById(
      transaction.businessTransactionId,
    );

    if (existing) {
      return existing;
    }

    //
    // 2. Resolve Policy
    //
    const policy = await this.policies.resolve(
      transaction.policy.name,
      transaction.policy.version,
    );

    if (!policy) {
      throw new Error("Policy not found.");
    }

    //
    // 3. Persist Business Transaction
    //
    const created = await this.transactions.create(transaction);

    //
    // 4. Create initial Execution Trust Record
    //
    const trustRecord: ExecutionTrustRecord = {
      trustRecordId: crypto.randomUUID(),

      businessTransactionId: created.businessTransactionId,

      transaction: created,

      overrides: [],

      executions: [],

      verifications: [],

      receipts: [],

      trustRecordHash: "",

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    await this.trustRecords.create(trustRecord);

    return created;
  }
}
