import crypto from "crypto";
import type { ReplayInput } from "./types/ReplayInput.js";
import type { ReplayResult } from "./types/ReplayResult.js";

export class ReplayEngine {
  replay(input: any): ReplayResult {
    // ✅ normalize input (CRITICAL FIX)
    const transactions = Array.isArray(input)
      ? input
      : input.transactions ?? [];

    if (!Array.isArray(transactions)) {
      throw new Error("Invalid replay input: transactions must be array");
    }

    // 1. deterministic sort
    const sorted = [...transactions].sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return a.timestamp - b.timestamp;
      }
      return String(a.id).localeCompare(String(b.id));
    });

    const executionOrder = sorted.map(t => t.id);

    // 2. deterministic execution
    const results = sorted.map(t => ({
      id: t.id,
      output: this.execute(t.payload ?? t.action ?? t),
    }));

    // 3. deterministic hash
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify({ executionOrder, results }))
      .digest("hex");

    return {
      executionOrder,
      results,
      hash,
    };
  }

  private execute(payload: unknown): unknown {
    return payload;
  }
}