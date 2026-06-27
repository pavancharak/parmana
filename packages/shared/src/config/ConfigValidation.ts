import {
  HashAlgorithms,
  type HashAlgorithm,
  SignatureAlgorithms,
  type SignatureAlgorithm,
} from "./CryptoAlgorithms.js";

import {
  StorageProviders,
  type StorageProvider,
} from "./StorageProviders.js";

import {
  KeyProviders,
  type KeyProvider,
} from "./KeyProviders.js";

import {
  TrustProfiles,
  type TrustProfile,
} from "./TrustProfiles.js";

function parse<T extends string>(
  value: string | undefined,
  values: Record<string, T>,
  name: string,
  defaultValue: T
): T {

  const resolved =
    value ?? defaultValue;

  if (
    Object.values(values).includes(
      resolved as T
    )
  ) {
    return resolved as T;
  }

  throw new Error(
    `Invalid ${name}: ${resolved}`
  );
}

export const parseStorageProvider =
(
  value?: string
): StorageProvider =>
  parse(
    value,
    StorageProviders,
    "DATABASE_PROVIDER",
    StorageProviders.MEMORY
  );

export const parseHashAlgorithm =
(
  value?: string
): HashAlgorithm =>
  parse(
    value,
    HashAlgorithms,
    "HASH_PROVIDER",
    HashAlgorithms.SHA256
  );

export const parseSignatureAlgorithm =
(
  value?: string
): SignatureAlgorithm =>
  parse(
    value,
    SignatureAlgorithms,
    "SIGNATURE_PROVIDER",
    SignatureAlgorithms.ED25519
  );

export const parseKeyProvider =
(
  value?: string
): KeyProvider =>
  parse(
    value,
    KeyProviders,
    "KEY_PROVIDER",
    KeyProviders.LOCAL
  );

export const parseTrustProfile =
(
  value?: string
): TrustProfile =>
  parse(
    value,
    TrustProfiles,
    "TRUST_PROFILE",
    TrustProfiles.V1
  );