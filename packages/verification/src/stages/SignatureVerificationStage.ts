import type { VerificationComponent } from "../VerificationComponent.js";
import type { VerificationContext } from "../context/VerificationContext.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Signature Verification Stage.
 *
 * Verifies the cryptographic signature associated
 * with an Execution Trust Record.
 *
 * This is currently a placeholder implementation.
 * Future versions will delegate verification to
 * the Crypto package.
 */
export class SignatureVerificationStage
  implements VerificationComponent
{
  /**
   * Execute signature verification.
   */
  public async execute(
    context: VerificationContext,
  ): Promise<VerificationContext> {
    if (!context) {
      throw new VerificationError(
        "VerificationContext is required.",
      );
    }

    if (!context.trustRecord) {
      throw new VerificationError(
        "ExecutionTrustRecord is required.",
      );
    }

    //
    // TODO:
    // Delegate cryptographic signature verification
    // to @parmana/crypto.
    //

    return context;
  }
}