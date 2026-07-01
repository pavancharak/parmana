/**
 * Parmana SDK
 *
 * Canonical SDK client.
 *
 * ParmanaClient is the primary entry point for interacting
 * with the Parmana Runtime.
 *
 * Responsibilities:
 * - Hold immutable SDK configuration.
 * - Compose SDK APIs.
 * - Delegate SDK operations.
 *
 * ParmanaClient does NOT:
 * - evaluate policy
 * - authorize execution
 * - execute business logic
 * - verify trust records
 * - replay executions
 * - communicate directly with the Runtime
 */

import type {
  BusinessTransaction,
  ExecutionTrustRecord,
  Receipt,
  Verification,
} from "../models/index.js";

import type {
  ReplayResult,
} from "../models/replay-result.js";

import type {
  Configuration,
} from "../config/Configuration.js";

import type {
  Transport,
} from "../config/Transport.js";

import type {
  Policy,
} from "@parmana/policy";

import {
  ConfigurationError,
} from "../errors/ConfigurationError.js";

import {
  HealthApi,
  type HealthStatus,
} from "./HealthApi.js";

import {
  ExecutionApi,
} from "./ExecutionApi.js";

import {
  VerificationApi,
} from "./VerificationApi.js";

import {
  ReplayApi,
} from "./ReplayApi.js";

import {
  ReceiptApi,
} from "./ReceiptApi.js";

import {
  TransactionApi,
} from "./TransactionApi.js";

import {
  TrustRecordApi,
} from "./TrustRecordApi.js";

import {
  PolicyApi,
  type PolicyValidationResult,
} from "./PolicyApi.js";

/**
 * Canonical Parmana SDK client.
 */
export class ParmanaClient {
  /**
   * Immutable SDK configuration.
   */
  public readonly configuration: Configuration;

  /**
   * Configured transport.
   */
  private readonly transport: Transport;

  /**
   * Runtime Health API.
   */
  private readonly healthApi: HealthApi;

  /**
   * Runtime Execution API.
   */
  private readonly executionApi: ExecutionApi;

  /**
   * Runtime Verification API.
   */
  private readonly verificationApi: VerificationApi;

  /**
   * Runtime Replay API.
   */
  private readonly replayApi: ReplayApi;

  /**
   * Runtime Receipt API.
   */
  private readonly receiptApi: ReceiptApi;

  /**
   * Runtime Transaction API.
   */
  private readonly transactionApi: TransactionApi;

  /**
   * Runtime Trust Record API.
   */
  private readonly trustRecordApi: TrustRecordApi;

  /**
   * Runtime Policy API.
   */
  private readonly policyApi: PolicyApi;

  /**
   * Creates a Parmana SDK client.
   */
  constructor(
    configuration: Configuration,
  ) {
    if (!configuration.endpoint) {
      throw new ConfigurationError(
        "Runtime endpoint is required.",
      );
    }

    if (!configuration.transport) {
      throw new ConfigurationError(
        "Transport is required.",
      );
    }

    this.configuration = configuration;
    this.transport = configuration.transport;

    //
    // Compose SDK APIs.
    //
    this.healthApi =
      new HealthApi(this.transport);

    this.executionApi =
      new ExecutionApi(this.transport);

    this.verificationApi =
      new VerificationApi(this.transport);

    this.replayApi =
      new ReplayApi(this.transport);

    this.receiptApi =
      new ReceiptApi(this.transport);

    this.transactionApi =
      new TransactionApi(this.transport);

    this.trustRecordApi =
      new TrustRecordApi(this.transport);

    this.policyApi =
      new PolicyApi(this.transport);
  }

  /**
   * Returns the configured Runtime endpoint.
   */
  public endpoint(): string {
    return this.configuration.endpoint;
  }

  /**
   * Performs a Runtime health check.
   */
  public health(): Promise<HealthStatus> {
    return this.healthApi.health();
  }

  /**
   * Executes a Business Transaction.
   */
  public execute(
    transaction: BusinessTransaction,
  ): Promise<ExecutionTrustRecord> {
    return this.executionApi.execute(
      transaction,
    );
  }

  /**
   * Returns the latest Verification.
   */
  public verify(
    businessTransactionId: string,
  ): Promise<Verification> {
    return this.verificationApi.verify(
      businessTransactionId,
    );
  }

  /**
   * Performs deterministic replay.
   */
  public replay(
    businessTransactionId: string,
  ): Promise<ReplayResult> {
    return this.replayApi.replay(
      businessTransactionId,
    );
  }

  /**
   * Generates an execution receipt.
   */
  public receipt(
    businessTransactionId: string,
  ): Promise<Receipt> {
    return this.receiptApi.generate(
      businessTransactionId,
    );
  }

  /**
   * Retrieves a Business Transaction.
   */
  public transaction(
    businessTransactionId: string,
  ): Promise<BusinessTransaction> {
    return this.transactionApi.get(
      businessTransactionId,
    );
  }

  /**
   * Lists Business Transactions.
   */
  public transactions(
    page = 1,
    pageSize = 25,
  ): Promise<BusinessTransaction[]> {
    return this.transactionApi.list(
      page,
      pageSize,
    );
  }

  /**
   * Retrieves an Execution Trust Record.
   */
  public trustRecord(
    businessTransactionId: string,
  ): Promise<ExecutionTrustRecord> {
    return this.trustRecordApi.get(
      businessTransactionId,
    );
  }

  /**
   * Validates a policy definition.
   */
  public validatePolicy(
    policy: Policy,
  ): Promise<PolicyValidationResult> {
    return this.policyApi.validate(
      policy,
    );
  }
}