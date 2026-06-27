import {
  BusinessTransaction,
  Decision,
  Execution,
  ExecutionEvidence,
  ExecutionTrustRecord,
  Override,
  PolicyReference,
  Receipt,
  Verification,
} from "@parmana/shared";

/**
 * Canonical Runtime Context.
 *
 * RuntimeContext is the single immutable object passed
 * between all stages of the Execution Trust Pipeline.
 *
 * Each stage returns a new RuntimeContext with one or
 * more additional artifacts populated.
 */
export interface RuntimeContext {
  /**
   * Root Business Transaction.
   */
  readonly transaction: BusinessTransaction;

  /**
   * Policy resolved for the transaction.
   */
  readonly policy?: PolicyReference;

  /**
   * Decision produced by the Policy Engine.
   */
  readonly decision?: Decision;

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
