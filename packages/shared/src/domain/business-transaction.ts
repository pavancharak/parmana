import { Authority } from "./authority.js";
import { Authorization } from "./authorization.js";
import { Decision } from "./decision.js";
import { Intent } from "./intent.js";
import { TransactionMetadata } from "./metadata.js";
import { PolicyReference } from "./policy-reference.js";

/**
 * Parmana Trust Core
 *
 * Business Transaction
 *
 * The canonical immutable business context
 * accepted by Parmana for execution.
 *
 * A Business Transaction captures the complete
 * upstream trust chain prior to execution.
 *
 * Authority
 *      ↓
 * Authorization
 *      ↓
 * Intent
 *      ↓
 * Policy
 *      ↓
 * Decision
 *
 * Every Business Transaction produces exactly
 * one Execution Trust Record.
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
   * Authority responsible for this
   * Business Transaction.
   */
  readonly authority: Authority;

  /**
   * Authorization granted by the Authority.
   */
  readonly authorization: Authorization;

  /**
   * Intended business action.
   */
  readonly intent: Intent;

  /**
   * Policy explicitly requested by the client
   * and successfully resolved.
   */
  readonly policy: PolicyReference;

  /**
   * Runtime signals evaluated by the Policy.
   *
   * Signals are runtime facts supplied to the
   * Policy during evaluation. Parmana treats
   * them as opaque data validated against the
   * Policy's Signal Schema.
   */
  readonly signals: Readonly<Record<string, unknown>>;

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

  VERIFIED = "VERIFIED",
}