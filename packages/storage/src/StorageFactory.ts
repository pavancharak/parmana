import { MemoryStorageProvider } from "./memory/MemoryStorageProvider.js";

import { SupabaseStorageProvider } from "./supabase/SupabaseStorageProvider.js";

import type { StorageProvider } from "./StorageProvider.js";

import type { StorageConfiguration } from "./StorageConfiguration.js";

/**
 * Creates Storage Providers.
 */
export class StorageFactory {
  /**
   * Creates a provider from configuration.
   */
  static create(configuration: StorageConfiguration): StorageProvider {
    switch (configuration.provider) {
      case "memory":
        return new MemoryStorageProvider();

      case "supabase":
        return new SupabaseStorageProvider();

      case "postgres":
        throw new Error("Postgres storage provider not implemented.");

      case "sqlite":
        throw new Error("SQLite storage provider not implemented.");
    }
  }

  /**
   * Creates a provider from environment.
   */
  static createFromEnvironment(): StorageProvider {
    return this.create({
      provider: (process.env.PARMANA_STORAGE ??
        "memory") as StorageConfiguration["provider"],
    });
  }
}
