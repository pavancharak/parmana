import { Metadata } from "../common/Metadata.js";
import { Timestamp } from "../common/Timestamp.js";

/**
 * Canonical execution status.
 */
export const ExecutionStatus = {
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

export type ExecutionStatus =
  (typeof ExecutionStatus)[keyof typeof ExecutionStatus];

/**
 * Represents the factual outcome of an execution.
 *
 * Execution is immutable.
 */
export class Execution {
  /**
   * Execution outcome.
   */
  public readonly status: ExecutionStatus;

  /**
   * System responsible for execution.
   *
   * Examples:
   *  - "openai"
   *  - "kubernetes"
   *  - "payments-api"
   */
  public readonly executor: string;

  /**
   * Reference to the external execution.
   */
  public readonly reference: string;

  /**
   * Execution completion timestamp.
   */
  public readonly executedAt: Timestamp;

  /**
   * Optional metadata.
   */
  public readonly metadata: Metadata;

  constructor(
    status: ExecutionStatus,
    executor: string,
    reference: string,
    executedAt: Timestamp,
    metadata: Metadata = new Metadata()
  ) {
    if (!executor.trim()) {
      throw new Error("Executor cannot be empty.");
    }

    if (!reference.trim()) {
      throw new Error("Execution reference cannot be empty.");
    }

    this.status = status;
    this.executor = executor;
    this.reference = reference;
    this.executedAt = executedAt;
    this.metadata = metadata;

    Object.freeze(this);
  }

  /**
   * Returns true when execution completed successfully.
   */
  public succeeded(): boolean {
    return this.status === ExecutionStatus.SUCCEEDED;
  }

  public toJSON() {
    return {
      status: this.status,
      executor: this.executor,
      reference: this.reference,
      executedAt: this.executedAt,
      metadata: this.metadata,
    };
  }
}