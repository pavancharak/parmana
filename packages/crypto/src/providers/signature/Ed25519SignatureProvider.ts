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
 * Placeholder implementation.
 *
 * Signing will be implemented once the
 * KeyProvider abstraction is introduced.
 */
export class Ed25519SignatureProvider
  implements SignatureProvider {

  public readonly algorithm: SignatureAlgorithm =
    SignatureAlgorithms.ED25519;

  async sign(
    _data: Uint8Array
  ): Promise<string> {

    throw new Error(
      "Ed25519 signing not implemented."
    );
  }

  async verify(
    _data: Uint8Array,
    _signature: string
  ): Promise<boolean> {

    throw new Error(
      "Ed25519 verification not implemented."
    );
  }
}