import crypto from "crypto";

import type { LedgerEntry } from "../types/LedgerEntry.js";

export function hashLedger(entry: Omit<LedgerEntry, "hash">): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(entry))
    .digest("hex");
}
