import {
  loadConfig,
} from "@parmana/shared";

import type {
  CryptoProvider,
} from "./providers/CryptoProvider.js";

import { CryptoBuilder } from "./CryptoBuilder.js";

import { HashRegistry } from "./providers/HashRegistry.js";
import { SignatureRegistry } from "./providers/SignatureRegistry.js";

// Built-in Providers
import { SHA256HashProvider } from "./providers/hash/SHA256HashProvider.js";
import { Ed25519SignatureProvider } from "./providers/signature/Ed25519SignatureProvider.js";

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
 * This is the ONLY place in the crypto package that
 * should reference concrete cryptographic algorithms.
 */
export class CryptoBootstrap {

  static create(): CryptoProvider {

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

    return new CryptoBuilder()

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
  }
}