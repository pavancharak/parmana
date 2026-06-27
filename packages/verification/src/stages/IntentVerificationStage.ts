import { Verification } from "@parmana/shared";

import type { VerificationComponent } from "../VerificationComponent.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Verifies that a Verification is present.
 *
 * This stage is intentionally minimal until the Verification
 * domain model is finalized.
 */
export class IntentVerificationStage implements VerificationComponent {
  /**
   * Executes the intent verification stage.
   *
   * @param verification Immutable verification.
   * @returns The same immutable verification.
   * @throws VerificationError if the verification is missing.
   */
  public execute(verification: Verification): Verification {
    if (!verification) {
      throw new VerificationError("Verification cannot be null or undefined.");
    }

    return verification;
  }
}
