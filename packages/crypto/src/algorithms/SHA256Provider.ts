import {
  HashAlgorithms,
} from "@parmana/shared";

import type {
  HashProvider,
} from "../providers/HashProvider.js";

import {
  SHA256HashProvider,
} from "../providers/hash/SHA256HashProvider.js";

/**
 * Legacy SHA-256 provider.
 *
 * @deprecated
 * Use SHA256HashProvider instead.
 *
 * This class is retained for backward compatibility
 * and delegates to the canonical implementation.
 */
export class SHA256Provider
  implements HashProvider {

  readonly algorithm =
    HashAlgorithms.SHA256;

  private readonly provider =
    new SHA256HashProvider();

  async hash(
    data: Uint8Array
  ): Promise<string> {

    return this.provider.hash(
      data
    );

  }

}