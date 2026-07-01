import { describe, expect, it } from "vitest";

import { Dilithium3SignatureProvider } from "../src/providers/signature/Dilithium3SignatureProvider.js";

describe("Dilithium3SignatureProvider", () => {
  it("signs and verifies successfully", async () => {
    const provider = new Dilithium3SignatureProvider();

    const data = new TextEncoder().encode("Hello Parmana");

    const signature = await provider.sign(data);

    expect(await provider.verify(data, signature)).toBe(true);
  });

  it("rejects a modified message", async () => {
    const provider = new Dilithium3SignatureProvider();

    const original = new TextEncoder().encode("Hello Parmana");

    const tampered = new TextEncoder().encode("Hello Hacker");

    const signature = await provider.sign(original);

    expect(await provider.verify(tampered, signature)).toBe(false);
  });

  it("rejects a modified signature", async () => {
    const provider = new Dilithium3SignatureProvider();

    const data = new TextEncoder().encode("Hello Parmana");

    const signature = await provider.sign(data);

    const corrupted =
      signature.substring(0, signature.length - 4) + "AAAA";

    expect(await provider.verify(data, corrupted)).toBe(false);
  });
});