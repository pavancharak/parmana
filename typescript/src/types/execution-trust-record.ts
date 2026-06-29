import { BusinessTransaction } from "./business-transaction.js";
import { Execution } from "./execution.js";
import { Override } from "./override.js";
import { Verification } from "./verification.js";
import { Receipt } from "./receipt.js";

/**
 * Parmana Trust Core
 *
 * Execution Trust Record
 *
 * Canonical immutable record representing everything
 * Parmana knows about a Business Transaction.
 *
 * The Execution Trust Record is the authoritative
 * source for replay, verification, audit, and
 * receipt generation.
 */
export interface ExecutionTrustRecord {
  /**
   * Unique Execution Trust Record identifier.
   */
  readonly trustRecordId: string;

  /**
   * Business Transaction identifier.
   */
  readonly businessTransactionId: string;

  /**
   * Canonical Business Transaction.
   */
  readonly transaction: BusinessTransaction;

  /**
   * Optional Override history.
   *
   * Business rules currently allow a single accepted
   * Override, but the history is modeled as an array
   * to preserve append-only evolution.
   */
  readonly overrides: readonly Override[];

  /**
   * Execution history.
   *
   * Multiple Executions may exist for long-running
   * workflows, retries, or future execution models.
   */
  readonly executions: readonly Execution[];

  /**
   * Verification history.
   *
   * Every verification produces a new immutable
   * Verification artifact.
   */
  readonly verifications: readonly Verification[];

  /**
   * Receipt history.
   *
   * Receipts are immutable cryptographic attestations
   * of Execution Trust Record state.
   */
  readonly receipts: readonly Receipt[];

  /**
   * Canonical hash of the Execution Trust Record.
   *
   * Computed over the canonical serialized form of
   * this aggregate.
   */
  readonly trustRecordHash: string;

  /**
   * UTC timestamp when the Execution Trust Record
   * was first created.
   */
  readonly createdAt: Date;

  /**
   * UTC timestamp when the Execution Trust Record
   * was last extended with a new immutable artifact.
   */
  readonly updatedAt: Date;
}
