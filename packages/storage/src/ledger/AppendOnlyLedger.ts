import type { LedgerEntry } from "./LedgerEntry.js";
import { StorageError } from "../errors/StorageError.js";
import { LedgerSerializer } from "./LedgerSerializer.js";

/**
 * Immutable append-only ledger.
 */
export class AppendOnlyLedger<T = unknown> {
  private readonly entries: LedgerEntry<T>[] = [];
  private readonly serializer = new LedgerSerializer();

  public append(entry: LedgerEntry<T>): void {
    if (!entry) {
      throw new StorageError("Ledger entry cannot be null.");
    }

    this.entries.push(Object.freeze({ ...entry }));
  }

  public all(): readonly LedgerEntry<T>[] {
    return this.entries;
  }

  public size(): number {
    return this.entries.length;
  }

  public last(): LedgerEntry<T> | null {
    const last = this.entries[this.entries.length - 1];
    return last ?? null;
  }

  public verifyIntegrity(): boolean {
    try {
      for (const entry of this.entries) {
        this.serializer.hash(entry);
      }
      return true;
    } catch {
      return false;
    }
  }
}