import { loadConfig } from "@parmana/shared";

import type {
  CryptoProvider,
} from "./CryptoProvider.js";

import { HashRegistry } from "./HashRegistry.js";
import { SignatureRegistry } from "./SignatureRegistry.js";

import { SHA256HashProvider } from "./hash/SHA256HashProvider.js";
import { Ed25519SignatureProvider } from "./signature/Ed25519SignatureProvider.js";

/**
 * Provider Factory.
 *
 * Creates the configured cryptographic providers.
 */
export class ProviderFactory {

  static create(): CryptoProvider {

    const config = loadConfig();

    const hashRegistry =
      new HashRegistry();

    const signatureRegistry =
      new SignatureRegistry();

    hashRegistry.register(
      new SHA256HashProvider()
    );

    signatureRegistry.register(
      new Ed25519SignatureProvider()
    );

    return {

      hash: hashRegistry.get(
        config.crypto.hashProvider
      ),

      signature: signatureRegistry.get(
        config.crypto.signatureProvider
      ),

    };
  }

}