import { StorageProviders, type StorageProvider } from "./StorageProviders.js";

import {
  HashAlgorithms,
  type HashAlgorithm,
  SignatureAlgorithms,
  type SignatureAlgorithm,
} from "./CryptoAlgorithms.js";

import { KeyProviders, type KeyProvider } from "./KeyProviders.js";

import { TrustProfiles, type TrustProfile } from "./TrustProfiles.js";

function requireValue<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  name: string,
  defaultValue: T,
): T {
  const resolved = value ?? defaultValue;

  if (allowed.includes(resolved as T)) {
    return resolved as T;
  }

  throw new Error(
    `Invalid ${name}: ${resolved}. Allowed values: ${allowed.join(", ")}`,
  );
}

export const parseStorageProvider = (value?: string): StorageProvider =>
  requireValue(
    value,
    Object.values(StorageProviders),
    "DATABASE_PROVIDER",
    StorageProviders.MEMORY,
  );

export const parseHashAlgorithm = (value?: string): HashAlgorithm =>
  requireValue(
    value,
    Object.values(HashAlgorithms),
    "HASH_PROVIDER",
    HashAlgorithms.SHA256,
  );

export const parseSignatureAlgorithm = (value?: string): SignatureAlgorithm =>
  requireValue(
    value,
    Object.values(SignatureAlgorithms),
    "SIGNATURE_PROVIDER",
    SignatureAlgorithms.ED25519,
  );

export const parseKeyProvider = (value?: string): KeyProvider =>
  requireValue(
    value,
    Object.values(KeyProviders),
    "KEY_PROVIDER",
    KeyProviders.LOCAL,
  );

export const parseTrustProfile = (value?: string): TrustProfile =>
  requireValue(
    value,
    Object.values(TrustProfiles),
    "TRUST_PROFILE",
    TrustProfiles.V1,
  );
