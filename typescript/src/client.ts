/**
 * Parmana TypeScript SDK
 *
 * ParmanaClient
 *
 * Primary SDK entry point.
 */

import type { AxiosInstance } from "axios";

import { createHttpClient } from "./http.js";

import type { BusinessTransaction } from "./types/business-transaction.js";
import type { ExecutionTrustRecord } from "./types/execution-trust-record.js";
import type { Receipt } from "./types/receipt.js";
import type { Verification } from "./types/verification.js";

export interface ParmanaClientOptions {
  /**
   * Parmana Runtime endpoint.
   */
  readonly endpoint?: string;

  /**
   * Optional API key.
   */
  readonly apiKey?: string;
}

export class ParmanaClient {
  private readonly http: AxiosInstance;

  private readonly endpoint: string;

  private readonly apiKey?: string;

  constructor(options: ParmanaClientOptions = {}) {
    this.endpoint =
      options.endpoint ??
      "http://localhost:8080";

    this.apiKey = options.apiKey;

    this.http = createHttpClient(
      this.endpoint,
      this.apiKey,
    );
  }

  /**
   * Execute a Business Transaction.
   */
  async execute(
    transaction: BusinessTransaction,
  ): Promise<Receipt> {
    const response = await this.http.post<Receipt>(
      "/v1/executions",
      transaction,
    );

    return response.data;
  }

  /**
   * Verify an Execution Trust Record.
   */
  async verify(
    record: ExecutionTrustRecord,
  ): Promise<Verification> {
    const response = await this.http.post<Verification>(
      "/v1/verifications",
      record,
    );

    return response.data;
  }

  /**
   * Replay an Execution Trust Record.
   */
  async replay(
    record: ExecutionTrustRecord,
  ): Promise<void> {
    await this.http.post(
      "/v1/replay",
      record,
    );
  }

  /**
   * Runtime health.
   */
  async health(): Promise<unknown> {
    const response = await this.http.get(
      "/v1/health",
    );

    return response.data;
  }

  /**
   * Runtime version.
   */
  async version(): Promise<unknown> {
    const response = await this.http.get(
      "/v1/version",
    );

    return response.data;
  }

  getEndpoint(): string {
    return this.endpoint;
  }

  getApiKey(): string | undefined {
    return this.apiKey;
  }
}