import {
  createPrivateKey,
  createPublicKey,
  sign,
  verify,
  type KeyObject,
} from "node:crypto";

import type { SignatureAlgorithm } from "@parmana/shared";

import { SignatureAlgorithms } from "@parmana/shared";

import type { SignatureProvider } from "../SignatureProvider.js";

import { FileKeyProvider } from "../key/FileKeyProvider.js";

/**
 * Ed25519 Signature Provider.
 *
 * Temporary implementation using a process-local
 * key pair. A persistent KeyProvider will replace
 * this in a later version.
 */
export class Ed25519SignatureProvider implements SignatureProvider {
  public readonly algorithm: SignatureAlgorithm = SignatureAlgorithms.ED25519;

  private readonly privateKey: KeyObject;

  private readonly publicKey: KeyObject;

  constructor() {
  const keyProvider = new FileKeyProvider();

  const keys = keyProvider.loadEd25519();

  this.privateKey = createPrivateKey(keys.privateKey);

  this.publicKey = createPublicKey(keys.publicKey);

  Object.freeze(this);
}

  async sign(data: Uint8Array): Promise<string> {
    const signature = sign(null, Buffer.from(data), this.privateKey);

    return signature.toString("base64");
  }

  async verify(data: Uint8Array, signature: string): Promise<boolean> {
    return verify(
      null,
      Buffer.from(data),
      this.publicKey,
      Buffer.from(signature, "base64"),
    );
  }
}
