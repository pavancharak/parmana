import { TransactionMetadata } from "./metadata.js";
import { PolicyReference } from "./policy-reference.js";
import { Decision } from "./decision.js";

/**
 * Parmana Trust Core
 *
 * Business Transaction
 *
 * The primary business resource of the Parmana API.
 *
 * A Business Transaction is immutable once accepted.
 * Every Business Transaction produces exactly one
 * Execution Trust Record.
 */
export interface BusinessTransaction {
  /**
   * Unique Business Transaction identifier.
   *
   * Same value as metadata.businessTransactionId.
   */
  readonly businessTransactionId: string;

  /**
   * Immutable transaction metadata.
   */
  readonly metadata: TransactionMetadata;

  /**
   * Policy explicitly requested by the client
   * and successfully resolved.
   */
  readonly policy: PolicyReference;

  /**
   * Business signals evaluated by the Policy.
   *
   * Parmana treats this as an opaque object.
   * Validation is performed using the Policy's
   * associated Signal Schema.
   */
  readonly signals: Record<string, unknown>;

  /**
   * Immutable Policy Decision.
   */
  readonly decision: Decision;

  /**
   * Current Business Transaction lifecycle.
   */
  readonly status: BusinessTransactionStatus;

  /**
   * UTC timestamp when the Business Transaction
   * was accepted by Parmana.
   */
  readonly createdAt: Date;
}

/**
 * Business Transaction lifecycle.
 *
 * Represents the overall progress of the
 * Business Transaction.
 */
export enum BusinessTransactionStatus {
  RECEIVED = "RECEIVED",

  POLICY_EVALUATED = "POLICY_EVALUATED",

  APPROVED = "APPROVED",

  REJECTED = "REJECTED",

  OVERRIDDEN = "OVERRIDDEN",

  EXECUTING = "EXECUTING",

  EXECUTED = "EXECUTED",

  FAILED = "FAILED",

  VERIFIED = "VERIFIED"
}
