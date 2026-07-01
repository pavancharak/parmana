/**
 * Parmana Transaction API.
 *
 * Retrieve Business Transactions.
 */

import type {
  BusinessTransaction,
} from "../models/index.js";

import type {
  Transport,
} from "../config/Transport.js";

/**
 * Transaction API.
 *
 * Responsibilities
 * ----------------
 * - Retrieve Business Transactions
 * - List Business Transactions
 *
 * This API does NOT:
 * - execute Business Transactions
 * - verify trust records
 * - replay executions
 * - generate receipts
 */
export class TransactionApi {
  constructor(
    private readonly transport: Transport,
  ) {}

  /**
   * Retrieve a Business Transaction.
   */
  public async get(
    businessTransactionId: string,
  ): Promise<BusinessTransaction> {
    const response =
      await this.transport.send<BusinessTransaction>({
        method: "GET",
        path: `/transactions/${businessTransactionId}`,
      });

    return response.body;
  }

  /**
   * List Business Transactions.
   */
  public async list(
    page = 1,
    pageSize = 25,
  ): Promise<BusinessTransaction[]> {
    const response =
      await this.transport.send<BusinessTransaction[]>({
        method: "GET",
        path:
          `/transactions?page=${page}&pageSize=${pageSize}`,
      });

    return response.body;
  }
}