import {
  AuthorizationVerifier,
  CryptoBootstrap,
  ExecutableContentHasher,
  SignerBootstrap,
  SignerKeyProviderAdapter,
  type KeyProvider,
} from "@parmana/crypto";
import type { ExecutionRelease, ReleaseVerifier } from "@parmana/execution-control";

/**
 * Independent release check for ExecutionControlService (defence in depth
 * against a caller holding the in-process gateway attestation).
 *
 * Re-verifies, side-effect free, everything the gateway verified before it
 * released: the signature and expiry under the signed keyId, that the
 * decision was APPROVED, and that the executable content still hashes to
 * the signed businessTransactionHash. It does not consume the nonce; the
 * gateway does that on the normal path.
 */
export function createReleaseVerifier(keyProvider?: KeyProvider): ReleaseVerifier {
  const crypto = CryptoBootstrap.create();
  const authorizationVerifier = new AuthorizationVerifier(crypto);
  const contentHasher = new ExecutableContentHasher(crypto);

  // The same key provider the gateway verifies with. Without one, resolve the
  // production signer lazily (SignerBootstrap is async; the control is sync).
  const keyProviderPromise: Promise<KeyProvider> =
    keyProvider !== undefined
      ? Promise.resolve(keyProvider)
      : SignerBootstrap.create().then((signer) => new SignerKeyProviderAdapter(signer));

  return async (release: ExecutionRelease): Promise<void> => {
    const { authorization, executableContent } = release;
    const keyProvider = await keyProviderPromise;
    const publicKey = await keyProvider.getPublicKey(authorization.keyId);

    const { valid, checks } = await authorizationVerifier.verify(
      authorization,
      publicKey,
    );

    if (!valid || !checks.signatureVerified || !checks.notExpired || !checks.versionSupported) {
      throw new Error("Execution Control refused release: authorization did not verify.");
    }

    if (authorization.payload.decisionOutcome !== "APPROVED") {
      throw new Error("Execution Control refused release: decision is not APPROVED.");
    }

    const actualHash = await contentHasher.hash(executableContent);

    if (actualHash !== authorization.payload.businessTransactionHash) {
      throw new Error("Execution Control refused release: executable content does not match the signed hash.");
    }
  };
}
