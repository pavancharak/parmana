import { CryptoModule } from "./CryptoModule.js";

import { HashRegistry } from "../providers/HashRegistry.js";
import { SignatureRegistry } from "../providers/SignatureRegistry.js";

import { SHA256HashProvider } from "../providers/hash/SHA256HashProvider.js";
import { Ed25519SignatureProvider } from "../providers/signature/Ed25519SignatureProvider.js";

/**
 * Built-in providers.
 */
export class BuiltinCryptoModule implements CryptoModule {
  registerHashProviders(registry: HashRegistry): void {
    registry.register(new SHA256HashProvider());
  }

  registerSignatureProviders(registry: SignatureRegistry): void {
    registry.register(new Ed25519SignatureProvider());
  }
}
