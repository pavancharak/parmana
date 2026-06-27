import { createHash } from "node:crypto";
import type { LedgerEntry } from "./LedgerEntry.js";

/**
 * Deterministic serialization for ledger entries.
 */
export class LedgerSerializer {
  public serialize(entry: LedgerEntry): string {
    return JSON.stringify(entry, Object.keys(entry).sort());
  }

  public hash(entry: LedgerEntry): string {
    const serialized = this.serialize(entry);

    return createHash("sha256").update(serialized).digest("hex");
  }
}
