import {
  generateKeyPairSync,
  sign,
  verify,
  type KeyObject,
} from "node:crypto";

import type {
  SignatureAlgorithm,
} from "@parmana/shared";

import {
  SignatureAlgorithms,
} from "@parmana/shared";

import type {
  SignatureProvider,
} from "../SignatureProvider.js";

/**
 * Ed25519 Signature Provider.
 *
 * Temporary implementation using a process-local
 * key pair. A persistent KeyProvider will replace
 * this in a later version.
 */
export class Ed25519SignatureProvider
  implements SignatureProvider {

  public readonly algorithm: SignatureAlgorithm =
    SignatureAlgorithms.ED25519;

  private readonly privateKey: KeyObject;

  private readonly publicKey: KeyObject;

  constructor() {

    const keys =
      generateKeyPairSync(
        "ed25519"
      );

    this.privateKey =
      keys.privateKey;

    this.publicKey =
      keys.publicKey;

    Object.freeze(this);

  }

  async sign(
    data: Uint8Array
  ): Promise<string> {

    const signature =
      sign(
        null,
        Buffer.from(data),
        this.privateKey
      );

    return signature.toString(
      "base64"
    );

  }

  async verify(
    data: Uint8Array,
    signature: string
  ): Promise<boolean> {

    return verify(
      null,
      Buffer.from(data),
      this.publicKey,
      Buffer.from(
        signature,
        "base64"
      )
    );

  }

}