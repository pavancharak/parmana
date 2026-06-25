import { Metadata } from "../common/Metadata.js";

/**
 * Authorization decision.
 */
export const AuthorizationDecision = {
  PERMIT: "PERMIT",
  DENY: "DENY",
} as const;

export type AuthorizationDecision =
  (typeof AuthorizationDecision)[keyof typeof AuthorizationDecision];

/**
 * Represents the authorization outcome for an Intent.
 *
 * Authorization is immutable.
 */
export class Authorization {
  /**
   * Authorization decision.
   */
  public readonly decision: AuthorizationDecision;

  /**
   * Policy identifier used during evaluation.
   */
  public readonly policyId: string;

  /**
   * Optional reason.
   */
  public readonly reason: string | undefined;

  /**
   * Optional metadata.
   */
  public readonly metadata: Metadata;

  constructor(
    decision: AuthorizationDecision,
    policyId: string,
    metadata: Metadata = new Metadata(),
    reason?: string
  ) {
    if (!policyId.trim()) {
      throw new Error("Policy identifier cannot be empty.");
    }

    this.decision = decision;
    this.policyId = policyId;
    this.metadata = metadata;
    this.reason = reason;

    Object.freeze(this);
  }

  /**
   * Returns true if execution is permitted.
   */
  public isPermitted(): boolean {
    return this.decision === AuthorizationDecision.PERMIT;
  }

  public toJSON() {
    return {
      decision: this.decision,
      policyId: this.policyId,
      reason: this.reason,
      metadata: this.metadata,
    };
  }
}