import { Policy, PolicyInput } from "./PolicyEngine.js";

export class PolicyAdapter {
  static toPolicyInput(transaction: any): PolicyInput {
    return {
      amount: transaction.amount ?? 0,
      currency: transaction.currency ?? "UNKNOWN",
      recipient: transaction.recipient ?? "UNKNOWN",
    };
  }
}