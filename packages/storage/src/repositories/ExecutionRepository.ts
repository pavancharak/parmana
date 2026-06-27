import type { LedgerEntry } from "../ledger/LedgerEntry.js";

export class ExecutionRepository {
  private readonly entries: LedgerEntry[] = [];

  public save(entry: LedgerEntry): void {
    this.entries.push(Object.freeze({ ...entry }));
  }

  public findAll(): readonly LedgerEntry[] {
    return this.entries;
  }

  public last(): LedgerEntry | null {
    const last = this.entries[this.entries.length - 1];
    return last ?? null;
  }
}
