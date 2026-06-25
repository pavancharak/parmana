import type { CryptoProvider } from "./CryptoProvider.js";
import type { HashProvider } from "./HashProvider.js";
import type { SignatureProvider } from "./SignatureProvider.js";

import { SHA256Provider } from "./algorithms/SHA256Provider.js";
import { Ed25519Provider } from "./algorithms/Ed25519Provider.js";

import { CryptoError } from "./errors/CryptoError.js";

/**
 * Builder for constructing a CryptoProvider.
 *
 * Provides a simple default configuration using:
 * - SHA-256 for hashing
 * - Ed25519 for signatures
 */
export class CryptoBuilder {
  private hashProvider: HashProvider = new SHA256Provider();
  private signatureProvider: SignatureProvider = new Ed25519Provider();

  /**
   * Override hash provider.
   */
  public withHash(provider: HashProvider): this {
    this.hashProvider = provider;
    return this;
  }

  /**
   * Override signature provider.
   */
  public withSignature(provider: SignatureProvider): this {
    this.signatureProvider = provider;
    return this;
  }

  /**
   * Builds the final CryptoProvider.
   */
  public build(): CryptoProvider {
    if (!this.hashProvider) {
      throw new CryptoError("Hash provider is required.");
    }

    if (!this.signatureProvider) {
      throw new CryptoError("Signature provider is required.");
    }

    return {
      hash: this.hashProvider,
      signature: this.signatureProvider,
    };
  }
}