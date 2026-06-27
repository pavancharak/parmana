import type { PolicyInput } from "@parmana/policy";

import type { RuntimeTransaction } from "./types/RuntimeTransaction.js";

export class PolicyAdapter {
  static toPolicyInput(transaction: RuntimeTransaction): PolicyInput {
    return {
      amount: transaction.amount ?? 0,

      currency: transaction.currency ?? "UNKNOWN",

      recipient: transaction.recipient ?? "UNKNOWN",
    };
  }
}
