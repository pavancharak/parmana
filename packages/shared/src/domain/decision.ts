import { PolicyReference } from "./policy-reference.js";

/**
 * Immutable Policy Decision.
 *
 * A Decision records the outcome of Policy evaluation.
 * Decisions never change once created.
 */
export interface Decision {
  /**
   * Unique Decision identifier.
   */
  readonly decisionId: string;

  /**
   * Policy evaluation outcome.
   */
  readonly outcome: DecisionOutcome;

  /**
   * Human-readable explanation.
   */
  readonly reason?: string;

  /**
   * UTC timestamp when evaluation completed.
   */
  readonly evaluatedAt: Date;

  /**
   * Exact Policy used to produce this Decision.
   */
  readonly policy: PolicyReference;
}

/**
 * Canonical Decision outcomes.
 */
export enum DecisionOutcome {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
