/**
 * Represents a digital signature provider.
 *
 * Implementations are responsible for generating and verifying
 * cryptographic signatures.
 */
export interface SignatureProvider {
  /**
   * Returns the algorithm identifier.
   *
   * Examples:
   * - Ed25519
   * - ECDSA-P256
   * - RSA-PSS
   */
  readonly algorithm: string;

  /**
   * Signs the supplied data.
   *
   * @param data Data to sign.
   * @param privateKey Private key bytes.
   * @returns Signature bytes.
   */
  sign(
    data: Uint8Array,
    privateKey: Uint8Array
  ): Uint8Array;

  /**
   * Verifies a signature.
   *
   * @param data Original data.
   * @param signature Signature bytes.
   * @param publicKey Public key bytes.
   * @returns True if the signature is valid.
   */
  verify(
    data: Uint8Array,
    signature: Uint8Array,
    publicKey: Uint8Array
  ): boolean;
}