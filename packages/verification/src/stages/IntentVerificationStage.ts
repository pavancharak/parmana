import type { VerificationComponent } from "../VerificationComponent.js";
import type { VerificationContext } from "../context/VerificationContext.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Intent Verification Stage.
 *
 * Verifies that the Execution Trust Record
 * contains a valid Intent artifact.
 */
export class IntentVerificationStage
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
    // Verify Intent artifact.
    //

    return context;
  }
}