import type {
  SignatureAlgorithm,
} from "@parmana/shared";

/**
 * Signature Provider.
 *
 * Abstraction for digital signatures.
 */
export interface SignatureProvider {
  /**
   * Canonical signature algorithm.
   */
  readonly algorithm: SignatureAlgorithm;

  /**
   * Creates a signature.
   */
  sign(
    data: Uint8Array
  ): Promise<string>;

  /**
   * Verifies a signature.
   */
  verify(
    data: Uint8Array,
    signature: string
  ): Promise<boolean>;
}