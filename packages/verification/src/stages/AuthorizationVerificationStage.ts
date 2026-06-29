import type { VerificationComponent } from "../VerificationComponent.js";
import type { VerificationContext } from "../context/VerificationContext.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Authorization Verification Stage.
 *
 * Verifies that the Execution Trust Record
 * contains a valid Authorization artifact.
 */
export class AuthorizationVerificationStage
  implements VerificationComponent
{
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
    // Verify Authorization artifact.
    //

    return context;
  }
}