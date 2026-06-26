import {
  BusinessTransaction,
  BusinessTransactionRepository,
} from "@parmana/shared";

/**
 * Application service responsible for accepting
 * Business Transactions.
 *
 * A Business Transaction becomes immutable once accepted.
 */
export class BusinessTransactionService {
  constructor(
    private readonly repository: BusinessTransactionRepository
  ) {}

  /**
   * Accepts a new Business Transaction.
   */
  async accept(
    transaction: BusinessTransaction
  ): Promise<BusinessTransaction> {

    const exists =
      await this.repository.exists(
        transaction.businessTransactionId
      );

    if (exists) {
      throw new Error(
        "Business Transaction already exists."
      );
    }

    return this.repository.create(
      transaction
    );
  }

  /**
   * Retrieves a Business Transaction.
   */
  async get(
    businessTransactionId: string
  ): Promise<BusinessTransaction | null> {

    return this.repository.findById(
      businessTransactionId
    );
  }

  /**
   * Lists Business Transactions.
   */
  async list(
    page = 1,
    pageSize = 25
  ): Promise<readonly BusinessTransaction[]> {

    return this.repository.list(
      page,
      pageSize
    );
  }
}