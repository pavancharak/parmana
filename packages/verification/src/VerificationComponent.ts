import type { Verification } from "@parmana/shared";

/**
 * Represents a single deterministic verification stage.
 *
 * Verification components are stateless and transform an immutable
 * Verification into a new immutable Verification.
 */
export interface VerificationComponent {
  /**
   * Executes this verification stage.
   *
   * @param verification Immutable verification.
   * @returns Immutable verification.
   */
  execute(verification: Verification): Verification;
}
