import { Metadata } from "../common/Metadata.js";
import { Timestamp } from "../common/Timestamp.js";

/**
 * Canonical verification outcome.
 */
export const VerificationStatus = {
  PASS: "PASS",
  FAIL: "FAIL",
  INCOMPLETE: "INCOMPLETE",
  UNKNOWN: "UNKNOWN",
} as const;

export type VerificationStatus =
  (typeof VerificationStatus)[keyof typeof VerificationStatus];

/**
 * Verification result for a single invariant.
 */
export interface VerificationInvariant {
  readonly name:
    | "authority"
    | "intent"
    | "authorization"
    | "execution"
    | "evidence"
    | "integrity";

  readonly status: VerificationStatus;

  readonly message?: string;
}

/**
 * Immutable verification result.
 *
 * Verification is derived from an ExecutionTransaction.
 * It never modifies the transaction.
 */
export class Verification {
  /**
   * Overall verification result.
   */
  public readonly status: VerificationStatus;

  /**
   * Individual invariant evaluations.
   */
  public readonly invariants: readonly VerificationInvariant[];

  /**
   * Verification timestamp.
   */
  public readonly verifiedAt: Timestamp;

  /**
   * Optional metadata.
   */
  public readonly metadata: Metadata;

  constructor(
    status: VerificationStatus,
    invariants: readonly VerificationInvariant[],
    verifiedAt: Timestamp = Timestamp.now(),
    metadata: Metadata = new Metadata()
  ) {
    this.status = status;
    this.invariants = Object.freeze([...invariants]);
    this.verifiedAt = verifiedAt;
    this.metadata = metadata;

    Object.freeze(this);
  }

  /**
   * Returns true if verification passed.
   */
  public passed(): boolean {
    return this.status === VerificationStatus.PASS;
  }

  /**
   * Returns an invariant by name.
   */
  public getInvariant(
    name: VerificationInvariant["name"]
  ): VerificationInvariant | undefined {
    return this.invariants.find((i) => i.name === name);
  }

  public toJSON() {
    return {
      status: this.status,
      invariants: this.invariants,
      verifiedAt: this.verifiedAt,
      metadata: this.metadata,
    };
  }
}
