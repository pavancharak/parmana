import type { PolicyInput } from "@parmana/policy";

import type { RuntimeTransaction } from "./types/RuntimeTransaction.js";

/**
 * Converts a RuntimeTransaction into the generic
 * PolicyInput consumed by the PolicyEngine.
 *
 * The runtime does not assume any business domain.
 * It simply forwards the transaction's runtime
 * signals to the policy engine.
 */
export class PolicyAdapter {
  static toPolicyInput(transaction: RuntimeTransaction): PolicyInput {
    return { ...(transaction.signals ?? {}) };
  }
}