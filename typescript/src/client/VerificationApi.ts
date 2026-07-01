/**
 * Parmana SDK
 *
 * Verification API.
 */

import type {
  Verification,
} from "../models/index.js";

import type {
  Transport,
} from "../config/Transport.js";

export class VerificationApi {
  constructor(
    private readonly transport: Transport,
  ) {}

  /**
   * Returns the latest Verification for a
   * Business Transaction.
   */
  public async verify(
    businessTransactionId: string,
  ): Promise<Verification> {
    const response =
      await this.transport.send<Verification>({
        path: `/verification/${businessTransactionId}`,
        method: "GET",
      });

    return response.body;
  }
}