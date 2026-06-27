import { HashRegistry } from "../providers/HashRegistry.js";
import { SignatureRegistry } from "../providers/SignatureRegistry.js";

/**
 * A crypto module registers one or more providers.
 */
export interface CryptoModule {

  registerHashProviders(
    registry: HashRegistry
  ): void;

  registerSignatureProviders(
    registry: SignatureRegistry
  ): void;

}