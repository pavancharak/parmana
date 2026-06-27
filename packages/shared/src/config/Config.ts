import type {
  HashAlgorithm,
  SignatureAlgorithm,
} from "./CryptoAlgorithms.js";

import type {
  StorageProvider,
} from "./StorageProviders.js";

import {
  optionalProperty,
} from "./ConfigUtils.js";

import type {
  KeyProvider,
} from "./KeyProviders.js";

import type {
  TrustProfile,
} from "./TrustProfiles.js";

import {
  parseStorageProvider,
  parseHashAlgorithm,
  parseSignatureAlgorithm,
  parseKeyProvider,
  parseTrustProfile,
} from "./ConfigValidation.js";

/**
 * Parmana Configuration.
 *
 * Centralized immutable configuration.
 *
 * This is the only configuration model used by
 * Parmana. Environment variables are converted
 * into strongly typed values through the
 * ConfigValidation module.
 */

/**
 * Root configuration.
 */
export interface Config {
  readonly environment: EnvironmentConfig;

  readonly storage: StorageConfig;

  readonly crypto: CryptoConfig;

  readonly keys: KeyConfig;

  readonly trust: TrustConfig;

  readonly api: ApiConfig;

  readonly logging: LoggingConfig;
}

/**
 * Runtime environment.
 */
export interface EnvironmentConfig {
  readonly nodeEnv: string;
}

/**
 * Storage configuration.
 */
export interface StorageConfig {
  readonly provider: StorageProvider;

  readonly databaseUrl?: string;
}

/**
 * Cryptographic configuration.
 */
export interface CryptoConfig {
  readonly hashProvider: HashAlgorithm;

  readonly signatureProvider: SignatureAlgorithm;
}

/**
 * Key management.
 */
export interface KeyConfig {
  readonly provider: KeyProvider;

  readonly privateKeyPath?: string;

  readonly publicKeyPath?: string;
}

/**
 * Trust profile configuration.
 */
export interface TrustConfig {
  readonly profile: TrustProfile;

  readonly receiptVersion: string;
}

/**
 * API configuration.
 */
export interface ApiConfig {
  readonly port: number;
}

/**
 * Logging configuration.
 */
export interface LoggingConfig {
  readonly level: string;
}

/**
 * Loads the immutable Parmana configuration.
 *
 * This is the only location where process.env
 * should be accessed.
 */
export function loadConfig(): Readonly<Config> {

  return Object.freeze({

    environment: Object.freeze({

      nodeEnv:
        process.env.NODE_ENV ??
        "development",

    }),

    storage: Object.freeze({

  provider:
    parseStorageProvider(
      process.env.DATABASE_PROVIDER
    ),

  ...optionalProperty(
  "databaseUrl",
  process.env.DATABASE_URL
),

}),

    crypto: Object.freeze({

      hashProvider:
        parseHashAlgorithm(
          process.env.HASH_PROVIDER
        ),

      signatureProvider:
        parseSignatureAlgorithm(
          process.env.SIGNATURE_PROVIDER
        ),

    }),

    keys: Object.freeze({

  provider:
    parseKeyProvider(
      process.env.KEY_PROVIDER
    ),

  ...optionalProperty(
  "privateKeyPath",
  process.env.PRIVATE_KEY_PATH
),

...optionalProperty(
  "publicKeyPath",
  process.env.PUBLIC_KEY_PATH
),

}),

    trust: Object.freeze({

      profile:
        parseTrustProfile(
          process.env.TRUST_PROFILE
        ),

      receiptVersion:
        process.env.RECEIPT_VERSION ??
        "1",

    }),

    api: Object.freeze({

      port: Number(
        process.env.PORT ?? 3000
      ),

    }),

    logging: Object.freeze({

      level:
        process.env.LOG_LEVEL ??
        "info",

    }),

  });
}