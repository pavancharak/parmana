import { Verification } from "@parmana/shared";

import type { VerificationComponent } from "../VerificationComponent.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Placeholder Authority verification stage.
 *
 * This stage currently validates only that a Verification
 * instance is present. More detailed authority validation
 * will be added as the Verification domain model evolves.
 */
export class AuthorityVerificationStage
  implements VerificationComponent
{
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