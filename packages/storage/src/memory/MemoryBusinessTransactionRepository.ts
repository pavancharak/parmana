import {
  BusinessTransaction,
  BusinessTransactionRepository,
} from "@parmana/shared";

/**
 * In-memory Business Transaction repository.
 *
 * Intended for development and testing.
 */
export class MemoryBusinessTransactionRepository
  implements BusinessTransactionRepository {

  private readonly transactions =
    new Map<string, BusinessTransaction>();

  async create(
    transaction: BusinessTransaction
  ): Promise<BusinessTransaction> {

    this.transactions.set(
      transaction.businessTransactionId,
      transaction
    );

    return transaction;
  }

  async findById(
    businessTransactionId: string
  ): Promise<BusinessTransaction | null> {

    return (
      this.transactions.get(
        businessTransactionId
      ) ?? null
    );
  }

  async exists(
    businessTransactionId: string
  ): Promise<boolean> {

    return this.transactions.has(
      businessTransactionId
    );
  }

  async list(
    page: number,
    pageSize: number
  ): Promise<readonly BusinessTransaction[]> {

    const values = [
      ...this.transactions.values(),
    ];

    const start =
      (page - 1) * pageSize;

    return values.slice(
      start,
      start + pageSize
    );
  }
}