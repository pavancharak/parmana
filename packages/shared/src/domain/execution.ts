import { ExecutionEvidence } from "./execution-evidence.js";
import { ExecutionMetadata } from "./execution-metadata.js";

/**
 * Parmana Trust Core
 *
 * Execution
 *
 * Records what actually happened after a Business
 * Transaction was authorized.
 *
 * Executions are immutable trust artifacts.
 */
export interface Execution {
  /**
   * Unique Execution identifier.
   */
  readonly executionId: string;

  /**
   * Business Transaction to which this Execution belongs.
   */
  readonly businessTransactionId: string;

  /**
   * Execution lifecycle state.
   */
  readonly status: ExecutionStatus;

  /**
   * Execution mode.
   */
  readonly mode: ExecutionMode;

  /**
   * UTC timestamp when execution started.
   */
  readonly startedAt: Date;

  /**
   * UTC timestamp when execution completed.
   *
   * Present only for terminal executions.
   */
  readonly completedAt?: Date;

  /**
   * Immutable execution evidence.
   */
  readonly evidence?: ExecutionEvidence;

  /**
   * Execution-specific metadata.
   */
  readonly metadata?: ExecutionMetadata;
}

/**
 * Canonical execution lifecycle.
 */
export enum ExecutionStatus {
  PROCESSING = "PROCESSING",

  COMPLETED = "COMPLETED",

  FAILED = "FAILED"
}

/**
 * Execution mode.
 */
export enum ExecutionMode {
  SYNC = "SYNC",

  ASYNC = "ASYNC"
}
