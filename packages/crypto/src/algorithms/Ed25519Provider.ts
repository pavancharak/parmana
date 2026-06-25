import { generateKeyPairSync, sign, verify } from "crypto";
import { CryptoError } from "../errors/CryptoError.js";

export class Ed25519Provider {
  readonly algorithm = "ed25519";

  generateKeyPair() {
    const { publicKey, privateKey } = generateKeyPairSync("ed25519");

    return {
      publicKey,
      privateKey,
    };
  }

  sign(data: Uint8Array, privateKey: any): Uint8Array {
    try {
      const signature = sign(null, Buffer.from(data), privateKey);
      return new Uint8Array(signature);
    } catch (err) {
      throw new CryptoError(`Signing failed: ${String(err)}`);
    }
  }

  verify(
    data: Uint8Array,
    signature: Uint8Array,
    publicKey: any
  ): boolean {
    try {
      return verify(
        null,
        Buffer.from(data),
        publicKey,
        Buffer.from(signature)
      );
    } catch {
      return false;
    }
  }
}