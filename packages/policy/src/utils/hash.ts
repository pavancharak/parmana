import crypto from "crypto";

export function hashLedger(entry: Omit<any, "hash">): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(entry))
    .digest("hex");
}