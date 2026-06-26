/**
 * Base immutable identifier.
 *
 * All Parmana identifiers derive from this class.
 */
export declare abstract class Identifier {
    readonly value: string;
    protected constructor(value: string);
    equals(other: Identifier): boolean;
    toString(): string;
}
//# sourceMappingURL=Identifier.d.ts.map
