import { createHash } from "node:crypto";

import {
  HashAlgorithms,
} from "@parmana/shared";

import type {
  HashProvider,
} from "../providers/HashProvider.js";

import {
  CryptoError,
} from "../errors/CryptoError.js";

/**
 * SHA-256 hash provider.
 */
export class SHA256Provider
  implements HashProvider {

  readonly algorithm =
    HashAlgorithms.SHA256;

  async hash(
    data: Uint8Array
  ): Promise<string> {

    try {

      return createHash("sha256")
        .update(data)
        .digest("hex");

    } catch (error) {

      throw new CryptoError(
        `SHA-256 hashing failed: ${String(error)}`
      );

    }
  }
}