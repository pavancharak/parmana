import {
  BusinessTransaction,
  ExecutionTrustRecord,
} from "@parmana/shared";

import { Runtime } from "./Runtime.js";

import { BusinessTransactionService } from "./services/business-transaction-service.js";

/**
 * Execution Trust Application.
 *
 * Coordinates the complete application workflow:
 *
 * 1. Accept the Business Transaction.
 * 2. Persist it.
 * 3. Execute it through the Runtime.
 * 4. Return the resulting Execution Trust Record.
 *
 * This class contains application orchestration only.
 * It contains no business rules.
 */
export class ExecutionTrustApplication {
  constructor(
    private readonly transactions: BusinessTransactionService,
    private readonly runtime: Runtime
  ) {
    Object.freeze(this);
  }

  /**
   * Accepts and executes a Business Transaction.
   */
  async execute(
    transaction: BusinessTransaction
  ): Promise<ExecutionTrustRecord> {

    //
    // Accept the transaction.
    //
    await this.transactions.accept(
      transaction
    );

    //
    // Execute the transaction.
    //
    return this.runtime.execute(
      transaction
    );
  }

  /**
   * Returns a previously accepted
   * Business Transaction.
   */
  async getTransaction(
    businessTransactionId: string
  ): Promise<BusinessTransaction | null> {

    return this.transactions.get(
      businessTransactionId
    );
  }

  /**
   * Lists accepted Business Transactions.
   */
  async listTransactions(
    page = 1,
    pageSize = 25
  ): Promise<readonly BusinessTransaction[]> {

    return this.transactions.list(
      page,
      pageSize
    );
  }
}