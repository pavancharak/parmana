/**
 * Base immutable identifier.
 *
 * All Parmana identifiers derive from this class.
 */
export class Identifier {
    value;
    constructor(value) {
        if (!value || value.trim().length === 0) {
            throw new Error("Identifier cannot be empty.");
        }
        this.value = value;
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
//# sourceMappingURL=Identifier.js.map