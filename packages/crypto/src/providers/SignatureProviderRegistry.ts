import type {
  SignatureAlgorithm,
} from "@parmana/shared";

import type {
  SignatureProvider,
} from "./SignatureProvider.js";

/**
 * Registry for Signature Providers.
 */
export class SignatureProviderRegistry {

  private readonly providers =
    new Map<
      SignatureAlgorithm,
      SignatureProvider
    >();

  register(
    provider: SignatureProvider
  ): this {

    this.providers.set(
      provider.algorithm,
      provider
    );

    return this;
  }

  resolve(
    algorithm: SignatureAlgorithm
  ): SignatureProvider {

    const provider =
      this.providers.get(
        algorithm
      );

    if (!provider) {
      throw new Error(
        `Unsupported signature algorithm: ${algorithm}`
      );
    }

    return provider;
  }
}