import { describe, it, expect } from "vitest";
import { SHA256Provider } from "../src/algorithms/SHA256Provider.js";

describe("SHA256Provider - Cryptographic Integrity", () => {
  it("should be deterministic", () => {
    const hasher = new SHA256Provider();

    const a = hasher.hash("parmana");
    const b = hasher.hash("parmana");

    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it("should differ for different inputs", () => {
    const hasher = new SHA256Provider();

    const a = hasher.hash("a");
    const b = hasher.hash("b");

    expect(Array.from(a)).not.toEqual(Array.from(b));
  });
});