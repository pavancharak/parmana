/**
 * Represents a deterministic cryptographic hash provider.
 *
 * Implementations must always produce the same hash for the
 * same input using the configured algorithm.
 */
export interface HashProvider {
  /**
   * Returns the algorithm identifier.
   *
   * Examples:
   * - SHA-256
   * - SHA-512
   * - SHA3-256
   */
  readonly algorithm: string;

  /**
   * Computes a hash for the supplied data.
   *
   * @param data Input bytes.
   * @returns Hash bytes.
   */
  hash(data: Uint8Array): Uint8Array;

  /**
   * Computes a hexadecimal hash.
   *
   * @param data Input bytes.
   * @returns Lowercase hexadecimal digest.
   */
  hashHex(data: Uint8Array): string;
}