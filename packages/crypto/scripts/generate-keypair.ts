import { generateKeyPairSync } from "node:crypto";

import { mkdirSync, writeFileSync } from "node:fs";

import { dirname, join } from "node:path";

import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const keysDir = join(root, "keys");

mkdirSync(keysDir, {
  recursive: true,
});

const { privateKey, publicKey } = generateKeyPairSync("ed25519");

writeFileSync(
  join(keysDir, "ed25519-private.pem"),
  privateKey.export({
    format: "pem",

    type: "pkcs8",
  }),
);

writeFileSync(
  join(keysDir, "ed25519-public.pem"),
  publicKey.export({
    format: "pem",

    type: "spki",
  }),
);

console.log("Ed25519 keypair generated.");
