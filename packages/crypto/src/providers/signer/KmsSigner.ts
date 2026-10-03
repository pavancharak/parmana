import { createPublicKey, type KeyObject } from "node:crypto";

import {
  DescribeKeyCommand,
  GetPublicKeyCommand,
  KMSClient,
  NotFoundException,
  SignCommand,
} from "@aws-sdk/client-kms";

import { SignatureAlgorithms, type SignatureAlgorithm } from "@parmana/shared";

import {
  DEFAULT_KEY_ID,
  currentVerificationKeyId,
  type KeyMetadata,
} from "../../KeyProvider.js";
import type { Signer } from "../../Signer.js";
import { CryptoError } from "../../errors/CryptoError.js";
import {
  commitmentMessage,
  requiresCommitment,
} from "../../SignatureCommitment.js";

/**
 * The only KMS key spec / signing algorithm pair this class supports
 * today, matching Parmana's existing PRIMARY_SIGNATURE_PROVIDER=ed25519
 * default -- AWS KMS added Ed25519 support (ECC_NIST_EDWARDS25519 /
 * ED25519_SHA_512, MessageType RAW) in November 2025, so no signature
 * algorithm migration is needed to adopt it (ADR-0009).
 */
const SUPPORTED_KEY_SPEC = "ECC_NIST_EDWARDS25519";
const SIGNING_ALGORITHM = "ED25519_SHA_512";

/**
 * A Parmana logical keyId: the same characters FileKeyProvider accepts.
 */
const LOGICAL_KEY_ID_PATTERN = /^[A-Za-z0-9._-]+$/;

/**
 * Maps a Parmana logical keyId (e.g. "default", "tenant.acme") to the
 * identifier AWS KMS's own APIs actually accept -- a key ID (UUID), a
 * full ARN, or an alias name/ARN (which must carry the "alias/"
 * prefix). Every call site in this codebase passes a bare logical
 * keyId straight from KeyProvider.DEFAULT_KEY_ID / TenantKeyResolver
 * (e.g. "default", "tenant.acme"); none of those are valid KMS
 * identifiers on their own, so passing them through unchanged (this
 * class's original behavior) always fails against real AWS with
 * ValidationException/NotFoundException. Mirrors FileKeyProvider's own
 * keyId -> "<keyId>.private.pem" filename convention: here, keyId ->
 * "alias/<keyId>". An explicit "alias/<name>" is passed through
 * unchanged, so it is never double-prefixed.
 *
 * A full ARN is refused, and a UUID shaped keyId is treated as an
 * alias name like any other logical id, never as a raw key ID. A keyId often comes
 * from the artifact being verified (a record's signature.keyId, a
 * request body on POST /audit/verify or /refusal/verify), and an ARN
 * can name a key in another AWS account: one whose key policy lets
 * anyone read its public key would make a record signed by that key
 * verify as valid. An alias always resolves in this deployment's own
 * account and region.
 */
export function resolveKmsKeyId(keyId: string): string {
  if (keyId.startsWith("alias/")) {
    const name = keyId.slice("alias/".length);

    if (name !== "" && LOGICAL_KEY_ID_PATTERN.test(name.replace(/\//g, ""))) {
      return keyId;
    }
  } else if (LOGICAL_KEY_ID_PATTERN.test(keyId)) {
    return `alias/${keyId}`;
  }

  throw new CryptoError(
    `Invalid KMS keyId ${JSON.stringify(keyId)}: expected a logical key id ` +
      '(for example "default" or "tenant.acme") or an "alias/" name. ' +
      "A key ARN is not accepted.",
  );
}

function algorithmFromKeySpec(keySpec: string | undefined): SignatureAlgorithm {
  if (keySpec === SUPPORTED_KEY_SPEC) {
    return SignatureAlgorithms.ED25519;
  }

  throw new CryptoError(
    `KmsSigner only supports ${SUPPORTED_KEY_SPEC} keys; got KeySpec=${JSON.stringify(keySpec)}.`,
  );
}

/**
 * AWS KMS Signer.
 *
 * Sign-without-release: the private key material for an asymmetric
 * KMS key never leaves KMS -- this class only ever calls the Sign and
 * GetPublicKey APIs, never anything that would export key material.
 * A fully compromised process holding valid AWS credentials for this
 * key can request signatures, but cannot exfiltrate the key itself,
 * unlike LocalFileSigner/FileKeyProvider.
 *
 * Credentials: no static AWS access keys. If AWS_ROLE_ARN is set, uses
 * @vercel/oidc-aws-credentials-provider to exchange Vercel's
 * per-invocation OIDC token for short-lived STS credentials (first-
 * party, vercel.com/docs/oidc/aws). Otherwise falls back to the AWS
 * SDK's own default credential provider chain (~/.aws/credentials
 * locally, an instance/task role elsewhere) -- this class never reads
 * or accepts a static access key/secret pair.
 */
export class KmsSigner implements Signer {
  private constructor(private readonly client: KMSClient) {}

  /**
   * Async factory, not a plain constructor: resolving credentials may
   * require a dynamic `import()` of the optional
   * @vercel/oidc-aws-credentials-provider peer dependency (this
   * package is ESM; there is no synchronous `require()` available to
   * load it lazily).
   */
  static async create(region: string = requireRegion()): Promise<KmsSigner> {
    const credentials = await resolveCredentials();

    return new KmsSigner(
      new KMSClient({
        region,
        ...(credentials !== undefined ? { credentials } : {}),
      }),
    );
  }

  async sign(keyId: string, data: Uint8Array): Promise<string> {
    //
    // KMS rejects a raw Ed25519 message over 4096 bytes. A larger message
    // (for example a full Execution Trust Record) is signed as a fixed
    // size commitment instead, see SignatureCommitment.ts. Messages at or
    // below the limit are signed raw, unchanged.
    //
    const message = requiresCommitment(data) ? commitmentMessage(data) : data;

    const response = await this.client.send(
      new SignCommand({
        KeyId: resolveKmsKeyId(keyId),
        Message: message,
        MessageType: "RAW",
        SigningAlgorithm: SIGNING_ALGORITHM,
      }),
    );

    if (!response.Signature) {
      throw new CryptoError(`KMS Sign returned no signature for key ${keyId}.`);
    }

    return Buffer.from(response.Signature).toString("base64");
  }

  async getPublicKey(keyId: string): Promise<KeyObject> {
    const response = await this.client.send(
      new GetPublicKeyCommand({ KeyId: resolveKmsKeyId(keyId) }),
    );

    if (!response.PublicKey) {
      throw new CryptoError(
        `KMS GetPublicKey returned no key material for ${keyId}.`,
      );
    }

    return createPublicKey({
      key: Buffer.from(response.PublicKey),
      format: "der",
      type: "spki",
    });
  }

  async getMetadata(keyId: string): Promise<KeyMetadata> {
    const response = await this.client.send(
      new DescribeKeyCommand({ KeyId: resolveKmsKeyId(keyId) }),
    );

    return {
      keyId,
      algorithm: algorithmFromKeySpec(response.KeyMetadata?.KeySpec),
    };
  }

  /**
   * The signing keys this deployment publishes: the default key and the
   * current verification key (PARMANA_VERIFICATION_KEY_ID), each only
   * if its alias exists. KMS has no cheap, scoped way to enumerate every
   * key in an account, and an account wide list would publish keys that
   * have nothing to do with Parmana, so this lists the logical ids this
   * process signs with. Lets GET /.well-known/jwks.json answer under
   * KEY_PROVIDER=aws-kms instead of 501. A record signed under an older
   * PARMANA_VERIFICATION_KEY_ID is still served by GET /keys/:keyId.
   */
  async listKeys(): Promise<string[]> {
    const candidates = [
      ...new Set([DEFAULT_KEY_ID, currentVerificationKeyId()]),
    ];

    const present = await Promise.all(
      candidates.map(async (keyId) =>
        (await this.hasKey(keyId)) ? keyId : undefined,
      ),
    );

    return present.filter((keyId): keyId is string => keyId !== undefined);
  }

  async hasKey(keyId: string): Promise<boolean> {
    try {
      resolveKmsKeyId(keyId);
    } catch {
      return false;
    }

    try {
      await this.client.send(
        new DescribeKeyCommand({ KeyId: resolveKmsKeyId(keyId) }),
      );

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }

      throw error;
    }
  }

  // listKeys() is intentionally not implemented -- optional on Signer
  // (see FileKeyProvider's own listKeys doc comment for the same
  // precedent). Enumerating every KMS key in an account/region is a
  // different, broader operation (ListKeys + per-key alias lookup)
  // than this codebase's key-discovery routes need today.
}

function requireRegion(): string {
  const region = process.env.AWS_REGION;

  if (!region) {
    throw new CryptoError("KmsSigner requires AWS_REGION to be set.");
  }

  return region;
}

/**
 * Resolves AWS credentials without ever accepting a static access
 * key/secret pair from this codebase's own configuration. When
 * AWS_ROLE_ARN is set, exchanges Vercel's OIDC token for short-lived
 * STS credentials; @vercel/oidc-aws-credentials-provider is an
 * optional peer dependency, dynamically imported so environments that
 * don't use Vercel OIDC federation (and haven't installed it) aren't
 * affected.
 */
async function resolveCredentials(): Promise<
  | ReturnType<
      Awaited<
        typeof import("@vercel/oidc-aws-credentials-provider")
      >["awsCredentialsProvider"]
    >
  | undefined
> {
  const roleArn = process.env.AWS_ROLE_ARN;

  if (!roleArn) {
    // undefined defers to the AWS SDK's own default credential
    // provider chain (~/.aws/credentials locally, an instance/task
    // role elsewhere).
    return undefined;
  }

  const { awsCredentialsProvider } =
    await import("@vercel/oidc-aws-credentials-provider");

  return awsCredentialsProvider({ roleArn });
}
