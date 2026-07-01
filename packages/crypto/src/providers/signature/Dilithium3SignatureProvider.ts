import { Buffer } from "node:buffer";

import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";

import {
  SignatureAlgorithms,
  type SignatureAlgorithm,
} from "@parmana/shared";

import type { SignatureProvider } from "../SignatureProvider.js";

export class Dilithium3SignatureProvider implements SignatureProvider {
  public readonly algorithm: SignatureAlgorithm =
    SignatureAlgorithms.DILITHIUM3;

  private readonly publicKey: Uint8Array;
  private readonly secretKey: Uint8Array;

  constructor() {
    console.log("[Crypto] Using ML-DSA-65 (Dilithium3)");
    const { publicKey, secretKey } = ml_dsa65.keygen();

    this.publicKey = publicKey;
    this.secretKey = secretKey;

    Object.freeze(this);
  }

  async sign(data: Uint8Array): Promise<string> {
    const signature = ml_dsa65.sign(data, this.secretKey);

    return Buffer.from(signature).toString("base64");
  }

  async verify(
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