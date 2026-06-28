import {
  BusinessTransaction,
  Execution,
  ExecutionEvidence,
  ExecutionTrustRecord,
  Override,
  Receipt,
  Verification,
} from "@parmana/shared";

/**
 * Canonical Runtime Context.
 *
 * RuntimeContext is the immutable state passed
 * between Runtime Components.
 *
 * BusinessTransaction is the canonical source of
 * Authority, Authorization, Intent, Policy and
 * Decision.
 *
 * Runtime Components append execution artifacts
 * without modifying the BusinessTransaction.
 */
export interface RuntimeContext {
  /**
   * Canonical immutable Business Transaction.
   */
  readonly transaction: BusinessTransaction;

  /**
   * Execution artifact.
   */
  readonly execution?: Execution;

  /**
   * Optional human override.
   */
  readonly override?: Override;

  /**
   * Evidence captured during execution.
   */
  readonly evidence?: readonly ExecutionEvidence[];

  /**
   * Verification artifact.
   */
  readonly verification?: Verification;

  /**
   * Cryptographic receipt.
   */
  readonly receipt?: Receipt;

  /**
   * Final aggregate produced by the pipeline.
   */
  readonly trustRecord?: ExecutionTrustRecord;
}