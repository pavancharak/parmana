import { Verification } from "@parmana/shared";

import type { VerificationComponent } from "../VerificationComponent.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Verifies that a Verification is present.
 *
 * This stage is intentionally minimal until the Authorization
 * verification model is finalized.
 */
export class AuthorizationVerificationStage
  implements VerificationComponent
{
  /**
   * Executes the authorization verification stage.
   *
   * @param verification Immutable verification.
   * @returns The same immutable verification.
   * @throws VerificationError if the verification is missing.
   */
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