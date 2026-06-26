import { BusinessTransaction } from "../domain/index.js";

/**
 * Repository for Business Transactions.
 *
 * Implementations may use PostgreSQL, Supabase,
 * DynamoDB, etc.
 */
export interface BusinessTransactionRepository {
  /**
   * Creates a new Business Transaction.
   */
  create(
    transaction: BusinessTransaction
  ): Promise<BusinessTransaction>;

  /**
   * Finds a Business Transaction.
   */
  findById(
    businessTransactionId: string
  ): Promise<BusinessTransaction | null>;

  /**
   * Checks whether a Business Transaction exists.
   */
  exists(
    businessTransactionId: string
  ): Promise<boolean>;

  /**
   * Lists Business Transactions.
   */
  list(
    page: number,
    pageSize: number
  ): Promise<readonly BusinessTransaction[]>;
}
