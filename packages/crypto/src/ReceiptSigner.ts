import { CanonicalSerializer } from "./CanonicalSerializer.js";

import type {
  CryptoProvider,
} from "./providers/CryptoProvider.js";

/**
 * Receipt Signer.
 *
 * Signs canonical receipt bytes using the
 * configured SignatureProvider.
 */
export class ReceiptSigner {

  constructor(
  private readonly crypto:
    CryptoProvider,

  private readonly serializer =
    new CanonicalSerializer()
) {}

  /**
   * Signs a receipt.
   */
  async sign(
    receipt: unknown
  ): Promise<string> {

    const bytes =
      this.serializer.serialize(
        receipt
      );

    return this.crypto.signature.sign(
      bytes
    );
  }
}