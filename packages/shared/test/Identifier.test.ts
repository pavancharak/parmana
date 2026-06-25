import { describe, expect, it } from "vitest";
import { Identifier } from "../src/common/Identifier.js";

class TestIdentifier extends Identifier {
  constructor(value: string) {
    super(value);
  }
}

describe("Identifier", () => {
  it("creates a valid identifier", () => {
    const id = new TestIdentifier("txn_123");

    expect(id.value).toBe("txn_123");
  });

  it("compares identifiers correctly", () => {
    const a = new TestIdentifier("txn_123");
    const b = new TestIdentifier("txn_123");

    expect(a.equals(b)).toBe(true);
  });

  it("rejects an empty identifier", () => {
    expect(() => new TestIdentifier("")).toThrow();
  });

  it("returns the identifier as a string", () => {
    const id = new TestIdentifier("txn_123");

    expect(id.toString()).toBe("txn_123");
  });

  it("serializes to JSON", () => {
    const id = new TestIdentifier("txn_123");

    const json = JSON.parse(JSON.stringify(id));

    expect(json).toEqual({
      value: "txn_123",
    });
  });
});