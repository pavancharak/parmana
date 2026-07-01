import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";

import { dirname, resolve } from "node:path";

import { generateKeyPairSync } from "node:crypto";

import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";

/**
 * Resolve the key directory at runtime.
 *
 * Do NOT resolve this at module load time because
 * dotenv loads environment variables after modules
 * are imported.
 */
function getKeyDir(): string {
  return (
    process.env.PARMANA_KEY_DIR ??
    resolve(process.cwd(), "keys")
  );
}

export class FileKeyProvider {
  //
  // Ed25519
  //

  loadEd25519() {
    const keyDir = getKeyDir();

    const publicPath = resolve(keyDir, "ed25519-public.pem");

    const privatePath = resolve(keyDir, "ed25519-private.pem");

    if (!existsSync(publicPath) || !existsSync(privatePath)) {
      mkdirSync(dirname(publicPath), { recursive: true });

      const keys = generateKeyPairSync("ed25519", {
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });

      writeFileSync(publicPath, keys.publicKey);

      writeFileSync(privatePath, keys.privateKey);
    }

    return {
      publicKey: readFileSync(publicPath, "utf8"),

      privateKey: readFileSync(privatePath, "utf8"),
    };
  }

  //
  // ML-DSA-65 (Dilithium3)
  //

  loadDilithium3() {
    const keyDir = getKeyDir();

    const publicPath = resolve(keyDir, "dilithium3-public.key");

    const privatePath = resolve(keyDir, "dilithium3-private.key");

    if (!existsSync(publicPath) || !existsSync(privatePath)) {
      mkdirSync(dirname(publicPath), { recursive: true });

      const keys = ml_dsa65.keygen();

      writeFileSync(publicPath, Buffer.from(keys.publicKey));

      writeFileSync(privatePath, Buffer.from(keys.secretKey));
    }

    return {
      publicKey: new Uint8Array(readFileSync(publicPath)),

      secretKey: new Uint8Array(readFileSync(privatePath)),
    };
  }
}