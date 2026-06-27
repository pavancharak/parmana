import type {
  HashAlgorithm,
} from "@parmana/shared";

import type {
  HashProvider,
} from "./HashProvider.js";

/**
 * Registry for Hash Providers.
 *
 * New algorithms can be registered without
 * modifying existing code.
 */
export class HashProviderRegistry {

  private readonly providers =
    new Map<HashAlgorithm, HashProvider>();

  register(
    provider: HashProvider
  ): this {

    this.providers.set(
      provider.algorithm,
      provider
    );

    return this;
  }

  resolve(
    algorithm: HashAlgorithm
  ): HashProvider {

    const provider =
      this.providers.get(
        algorithm
      );

    if (!provider) {
      throw new Error(
        `Unsupported hash algorithm: ${algorithm}`
      );
    }

    return provider;
  }
}