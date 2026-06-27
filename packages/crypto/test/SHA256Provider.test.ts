import { describe, it, expect } from "vitest";

import { SHA256Provider } from "../src/algorithms/SHA256Provider.js";

describe("SHA256Provider - Cryptographic Integrity", () => {

  it("should be deterministic", async () => {

    const hasher = new SHA256Provider();

    const encoder =
      new TextEncoder();

    const a =
      await hasher.hash(
        encoder.encode("parmana")
      );

    const b =
      await hasher.hash(
        encoder.encode("parmana")
      );

    expect(a).toBe(b);

  });

  it("should differ for different inputs", async () => {

    const hasher = new SHA256Provider();

    const encoder =
      new TextEncoder();

    const a =
      await hasher.hash(
        encoder.encode("a")
      );

    const b =
      await hasher.hash(
        encoder.encode("b")
      );

    expect(a).not.toBe(b);

  });

});