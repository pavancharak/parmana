/**
 * Base class for strongly typed immutable identifiers.
 *
 * All domain identifiers in Parmana derive from this class.
 *
 * Examples:
 * - TransactionId
 * - AuthorityId
 * - IntentId
 * - EvidenceId
 * - VerificationId
 */
export abstract class Identifier {
  /**
   * Immutable identifier value.
   */
  public readonly value: string;

  protected constructor(value: string) {
    if (typeof value !== "string") {
      throw new TypeError("Identifier must be a string.");
    }

    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new Error("Identifier cannot be empty.");
    }

    this.value = normalized;

    Object.freeze(this);
  }

  /**
   * Compares two identifiers.
   */
  public equals(other: Identifier): boolean {
    return this.value === other.value;
  }

  /**
   * Returns the identifier as a string.
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Enables JSON serialization.
   */
  public toJSON(): string {
    return this.value;
  }
}
