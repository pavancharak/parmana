import type { VerificationComponent } from "../VerificationComponent.js";
import type { VerificationContext } from "../context/VerificationContext.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Integrity Verification Stage.
 *
 * Performs basic structural validation of the
 * VerificationContext.
 */
export class IntegrityStage
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

    return context;
  }
}