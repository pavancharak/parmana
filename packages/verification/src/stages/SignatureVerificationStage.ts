import { Verification } from "@parmana/shared";

import type { VerificationComponent } from "../VerificationComponent.js";
import { VerificationError } from "../errors/VerificationError.js";

/**
 * Verifies the cryptographic signature associated with a Verification.
 *
 * This is currently a placeholder implementation.
 * Future versions will delegate verification to the Crypto package.
 */
export class SignatureVerificationStage implements VerificationComponent {
  /**
   * Executes the signature verification stage.
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
