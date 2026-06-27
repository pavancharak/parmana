import { CanonicalSerializer } from "./CanonicalSerializer.js";

import type {
  CryptoProvider,
} from "./providers/CryptoProvider.js";

/**
 * Signature Verifier.
 *
 * Verifies signatures using the configured
 * SignatureProvider.
 */
export class SignatureVerifier {

  constructor(
    private readonly serializer =
      new CanonicalSerializer(),

    private readonly crypto:
      CryptoProvider
  ) {}

  /**
   * Verifies a signature.
   */
  async verify(
    artifact: unknown,
    signature: string
  ): Promise<boolean> {

    const bytes =
      this.serializer.serialize(
        artifact
      );

    return this.crypto.signature.verify(
      bytes,
      signature
    );
  }
}