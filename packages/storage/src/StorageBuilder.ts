import { StorageEngine } from "./StorageEngine.js";

/**
 * Builder for StorageEngine.
 *
 * Provides a clean construction API for storage subsystem.
 */
export class StorageBuilder {
  /**
   * Builds a fully configured StorageEngine.
   */
  public build(): StorageEngine {
    return new StorageEngine();
  }
}