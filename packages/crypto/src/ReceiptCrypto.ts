import type { Receipt } from "@parmana/shared";

import { CryptoBootstrap } from "./CryptoBootstrap.js";

import { ReceiptHasher } from "./ReceiptHasher.js";

import { ReceiptSigner } from "./ReceiptSigner.js";

import { TrustRecordHasher } from "./TrustRecordHasher.js";

/**
 * Receipt cryptographic operations.
 *
 * Owns all receipt-related cryptographic
 * operations for Parmana.
 *
 * The runtime never knows which algorithms
 * are configured.
 */
export class ReceiptCrypto {
  private readonly crypto = CryptoBootstrap.create();

  private readonly trustRecordHasher = new TrustRecordHasher(this.crypto);

  private readonly receiptHasher = new ReceiptHasher(this.trustRecordHasher);

  private readonly signer = new ReceiptSigner(this.crypto);

  /**
   * Computes the canonical receipt hash.
   */
  async hash(trustRecord: unknown): Promise<string> {
    return this.receiptHasher.hash(trustRecord);
  }

  /**
   * Signs any canonical object.
   */
  async sign(value: unknown): Promise<string> {
    return this.signer.sign(value);
  }

  /**
   * Creates a signed Receipt.
   *
   * The signing algorithm is determined by
   * the configured SignatureProvider.
   */
  async createReceipt(
    payload: Omit<Receipt, "signature" | "algorithm">,
  ): Promise<Receipt> {
    const unsignedReceipt = {
      ...payload,

      algorithm: this.crypto.signature.algorithm,
    };

    const signature = await this.sign(unsignedReceipt);

    return {
      ...unsignedReceipt,

      signature,
    };
  }
}
