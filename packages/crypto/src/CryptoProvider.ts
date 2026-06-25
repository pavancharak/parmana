import type { HashProvider } from "./HashProvider.js";
import type { SignatureProvider } from "./SignatureProvider.js";

/**
 * Unified cryptographic provider abstraction.
 *
 * Combines hashing and digital signature capabilities into a
 * single interface used by the Crypto package and higher-level
 * Parmana systems (Runtime, Verification, Storage).
 */
export interface CryptoProvider {
  /**
   * Hashing implementation.
   */
  readonly hash: HashProvider;

  /**
   * Signature implementation.
   */
  readonly signature: SignatureProvider;
}