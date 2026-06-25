import { describe, it, expect } from "vitest";
import { Ed25519Provider } from "../src/algorithms/Ed25519Provider.js";

describe("Ed25519Provider - Sign/Verify", () => {
  it("should verify valid signature", () => {
    const crypto = new Ed25519Provider();

    const keypair = crypto.generateKeyPair();

    const message = "parmana-test";

    const signature = crypto.sign(message, keypair.privateKey);

    const valid = crypto.verify(message, signature, keypair.publicKey);

    expect(valid).toBe(true);
  });
});