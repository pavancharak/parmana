import { Buffer } from "node:buffer";

import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";

import {
  SignatureAlgorithms,
  type SignatureAlgorithm,
} from "@parmana/shared";


import type { SignatureProvider } from "../SignatureProvider.js";

/**
 * Dilithium3 (ML-DSA-65) Signature Provider.
 *
 * Uses persistent keys provided by FileKeyProvider.
 */
export class Dilithium3SignatureProvider
  implements SignatureProvider
{
  public readonly algorithm: SignatureAlgorithm =
    SignatureAlgorithms.DILITHIUM3;

  private readonly publicKey: Uint8Array;

  private readonly secretKey: Uint8Array;

  public constructor() {
    const keys =
  ml_dsa65.keygen();

this.publicKey =
  keys.publicKey;

this.secretKey =
  keys.secretKey;

    this.publicKey = keys.publicKey;
    this.secretKey = keys.secretKey;

    Object.freeze(this);
  }

  public async sign(
    data: Uint8Array,
  ): Promise<string> {
    const signature =
      ml_dsa65.sign(
        data,
        this.secretKey,
      );

    return Buffer.from(signature)
      .toString("base64");
  }

  public async verify(
    data: Uint8Array,
    signature: string,
  ): Promise<boolean> {
    return ml_dsa65.verify(
      Buffer.from(signature, "base64"),
      data,
      this.publicKey,
    );
  }
}