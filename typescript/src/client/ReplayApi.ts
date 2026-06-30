/**
 * Parmana TypeScript SDK
 *
 * Replay API.
 *
 * Provides deterministic replay of previously
 * executed Business Transactions.
 *
 * Responsibilities:
 * - Submit ReplayRequest objects.
 * - Return ReplayResult objects.
 *
 * This API does NOT:
 * - execute business transactions
 * - evaluate policy
 * - authorize execution
 * - verify trust records
 */

import type {
  Transport,
} from "../config/Transport.js";

import type {
  ReplayRequest,
} from "../models/ReplayRequest.js";

import type {
  ReplayResult,
} from "../models/ReplayResult.js";

/**
 * Replay API.
 */
export class ReplayApi {
  /**
   * Creates a Replay API.
   */
  constructor(
    private readonly transport: Transport,
  ) {}

  /**
   * Performs deterministic replay of an
   * Execution Trust Record.
   */
  public async replay(
    request: ReplayRequest,
  ): Promise<ReplayResult> {
    const response =
      await this.transport.send<ReplayResult>({
        path: "/replay",

        method: "POST",

        body: request,
      });

    return response.body;
  }
}