import {
  loadConfig,
} from "@parmana/shared";

import type {
  CryptoProvider,
} from "./providers/CryptoProvider.js";

import {
  CryptoBuilder,
} from "./CryptoBuilder.js";

import {
  HashRegistry,
} from "./providers/HashRegistry.js";

import {
  SignatureRegistry,
} from "./providers/SignatureRegistry.js";

// Built-in Providers
import {
  SHA256HashProvider,
} from "./providers/hash/SHA256HashProvider.js";

import {
  Ed25519SignatureProvider,
} from "./providers/signature/Ed25519SignatureProvider.js";

/**
 * Crypto Bootstrap.
 *
 * Composition root for the Parmana crypto subsystem.
 *
 * Responsibilities:
 *
 * - Load configuration
 * - Register built-in providers
 * - Register future plugins
 * - Build the CryptoProvider
 *
 * The configured CryptoProvider is cached so that
 * cryptographic providers (especially the signature
 * provider) are reused for the lifetime of the process.
 *
 * This is the ONLY place in the crypto package that
 * should reference concrete cryptographic algorithms.
 */
export class CryptoBootstrap {

  private static provider:
    CryptoProvider | undefined;

  static create(): CryptoProvider {

    if (this.provider) {
      return this.provider;
    }

    const config =
      loadConfig();

    const hashRegistry =
      new HashRegistry();

    const signatureRegistry =
      new SignatureRegistry();

    //
    // Register built-in hash providers
    //
    hashRegistry.register(
      new SHA256HashProvider()
    );

    //
    // Register built-in signature providers
    //
    signatureRegistry.register(
      new Ed25519SignatureProvider()
    );

    //
    // Future extension point:
    //
    // PluginLoader.load(hashRegistry);
    // PluginLoader.load(signatureRegistry);
    //

    this.provider =
      new CryptoBuilder()

        .withHash(
          hashRegistry.get(
            config.crypto.hashProvider
          )
        )

        .withSignature(
          signatureRegistry.get(
            config.crypto.signatureProvider
          )
        )

        .build();

    return this.provider;

  }

}