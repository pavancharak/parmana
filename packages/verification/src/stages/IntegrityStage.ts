import { Verification } from "@parmana/shared";

import type { VerificationComponent } from "../VerificationComponent.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Performs structural verification.
 */
export class IntegrityStage implements VerificationComponent {
  public execute(
    verification: Verification
  ): Verification {
    if (!verification) {
      throw new VerificationError(
        "Verification cannot be null or undefined."
      );
    }

    return verification;
  }
}