/**
 * Base error for all Verification-related failures.
 *
 * All Verification exceptions should extend this class.
 */
export class VerificationError extends Error {
  /**
   * Creates a new VerificationError.
   *
   * @param message Error message.
   */
  constructor(message: string) {
    super(message);

    this.name = "VerificationError";

    Object.setPrototypeOf(this, new.target.prototype);
  }
}