import type { VerificationComponent } from "../VerificationComponent.js";
import type { VerificationContext } from "../context/VerificationContext.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Evidence Verification Stage.
 *
 * Verifies the execution evidence contained
 * in the Execution Trust Record.
 */
export class EvidenceVerificationStage
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
    // Verify Execution Evidence.
    //

    return context;
  }
}