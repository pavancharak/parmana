/**
 * Parmana SDK
 *
 * Runtime API.
 *
 * Provides access to the Parmana Runtime execution API.
 *
 * Responsibilities:
 * - Submit BusinessTransaction objects.
 * - Return the resulting ExecutionTrustRecord.
 *
 * This API does NOT:
 * - evaluate policy
 * - authorize execution
 * - perform verification
 * - replay executions
 */

import type {
  BusinessTransaction,
  ExecutionTrustRecord,
} from "../models/index.js";

import type {
  Transport,
} from "../config/Transport.js";

/**
 * Runtime API.
 */
export class RuntimeApi {
  constructor(
    private readonly transport: Transport,
  ) {}

  /**
   * Executes a BusinessTransaction through the
   * Parmana Runtime.
   */
  public async execute(
    transaction: BusinessTransaction,
  ): Promise<ExecutionTrustRecord> {
    const response =
      await this.transport.send<ExecutionTrustRecord>(
        {
          path: "/execute",

          method: "POST",

          body: transaction,
        },
      );

    return response.body;
  }
}