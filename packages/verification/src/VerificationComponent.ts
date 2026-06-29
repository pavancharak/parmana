import type { VerificationContext } from "./context/VerificationContext.js";

/**
 * Represents a single deterministic verification stage.
 *
 * Verification components are stateless and transform an immutable
 * VerificationContext into a new immutable VerificationContext.
 */
export interface VerificationComponent {
  /**
   * Execute one verification stage.
   */
  execute(
    context: VerificationContext,
  ): Promise<VerificationContext>;
}