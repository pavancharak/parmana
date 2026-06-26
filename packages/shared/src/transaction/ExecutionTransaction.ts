import { Authority } from "../authority/Authority.js";
import { Authorization } from "../authorization/Authorization.js";
import { Metadata } from "../common/Metadata.js";
import { Timestamp } from "../common/Timestamp.js";
import { Evidence } from "../evidence/Evidence.js";
import { Execution } from "../execution/Execution.js";
import { Intent } from "../intent/Intent.js";
import { TransactionId } from "./TransactionId.js";
import {
  TransactionStatus,
  type TransactionStatus as TransactionStatusType,
} from "./TransactionStatus.js";

/**
 * Root aggregate of the Parmana domain.
 *
 * Every trusted execution is represented by exactly one
 * ExecutionTransaction.
 */
export class ExecutionTransaction {
  public readonly id: TransactionId;

  public readonly status: TransactionStatusType;

  public readonly authority: Authority;

  public readonly intent: Intent;

  public readonly authorization: Authorization;

  public readonly execution: Execution;

  public readonly evidence: Evidence;

  public readonly createdAt: Timestamp;

  public readonly metadata: Metadata;

  constructor(
    id: TransactionId,
    authority: Authority,
    intent: Intent,
    authorization: Authorization,
    execution: Execution,
    evidence: Evidence,
    createdAt: Timestamp = Timestamp.now(),
    metadata: Metadata = new Metadata(),
    status: TransactionStatusType = TransactionStatus.COMPLETED
  ) {
    this.id = id;
    this.authority = authority;
    this.intent = intent;
    this.authorization = authorization;
    this.execution = execution;
    this.evidence = evidence;
    this.createdAt = createdAt;
    this.metadata = metadata;
    this.status = status;

    Object.freeze(this);
  }

  /**
   * Returns a new transaction with updated evidence.
   */
  public withEvidence(
    evidence: Evidence,
    status: TransactionStatusType = this.status
  ): ExecutionTransaction {
    return new ExecutionTransaction(
      this.id,
      this.authority,
      this.intent,
      this.authorization,
      this.execution,
      evidence,
      this.createdAt,
      this.metadata,
      status
    );
  }

  /**
   * Returns a new transaction with a different status.
   */
  public withStatus(
    status: TransactionStatusType
  ): ExecutionTransaction {
    return new ExecutionTransaction(
      this.id,
      this.authority,
      this.intent,
      this.authorization,
      this.execution,
      this.evidence,
      this.createdAt,
      this.metadata,
      status
    );
  }

  /**
   * Equality based on transaction identifier.
   */
  public equals(other: ExecutionTransaction): boolean {
    return this.id.equals(other.id);
  }

  public toJSON() {
    return {
      id: this.id,
      status: this.status,
      authority: this.authority,
      intent: this.intent,
      authorization: this.authorization,
      execution: this.execution,
      evidence: this.evidence,
      createdAt: this.createdAt,
      metadata: this.metadata,
    };
  }
}
