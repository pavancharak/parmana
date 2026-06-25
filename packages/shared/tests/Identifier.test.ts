import { describe, expect, it } from "vitest";

import { Identifier } from "../src/common/Identifier.js";

class TestId extends Identifier {
    constructor(value: string) {
        super(value);
    }
}

describe("Identifier", () => {

    it("creates identifier", () => {

        const id = new TestId("abc");

        expect(id.toString()).toBe("abc");

    });

    it("compares identifiers", () => {

        const a = new TestId("abc");

        const b = new TestId("abc");

        expect(a.equals(b)).toBe(true);

    });

    it("rejects empty identifiers", () => {

        expect(() => {

            new TestId("");

        }).toThrow();

    });

});