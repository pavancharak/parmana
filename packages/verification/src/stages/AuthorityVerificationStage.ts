import type { VerificationComponent } from "../VerificationComponent.js";
import type { VerificationContext } from "../context/VerificationContext.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Authority Verification Stage.
 *
 * Verifies that the Execution Trust Record
 * originated from a valid authority.
 */
export class AuthorityVerificationStage
  implements VerificationComponent
{
  /**
   * Execute authority verification.
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
    // Verify Authority artifact.
    //

    return context;
  }
}