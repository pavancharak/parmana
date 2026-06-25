import { createHash } from "node:crypto";

import type { HashProvider } from "../HashProvider.js";
import { CryptoError } from "../errors/CryptoError.js";

/**
 * SHA-256 hashing implementation using Node.js crypto.
 */
export class SHA256Provider implements HashProvider {
  public readonly algorithm = "SHA-256";

  public hash(data: Uint8Array): Uint8Array {
    try {
      const hash = createHash("sha256");
      hash.update(data);
      return new Uint8Array(hash.digest());
    } catch (err: unknown) {
      throw new CryptoError(
        `SHA256 hashing failed: ${String(err)}`
      );
    }
  }

  public hashHex(data: Uint8Array): string {
    try {
      const hash = createHash("sha256");
      hash.update(data);
      return hash.digest("hex");
    } catch (err: unknown) {
      throw new CryptoError(
        `SHA256 hex hashing failed: ${String(err)}`
      );
    }
  }
}