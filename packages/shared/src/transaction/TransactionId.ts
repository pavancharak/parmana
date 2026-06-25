import { Identifier } from "../common/Identifier.js";

/**
 * Strongly typed identifier for an ExecutionTransaction.
 *
 * Examples:
 *  - txn_01K4V8A2N7X3R9Y6B1Q5C8D4E
 *  - txn_demo_001
 */
export class TransactionId extends Identifier {
  /**
   * Prefix used for transaction identifiers.
   */
  public static readonly PREFIX = "txn_";

  constructor(value: string) {
    super(value);

    if (!value.startsWith(TransactionId.PREFIX)) {
      throw new Error(
        `TransactionId must start with '${TransactionId.PREFIX}'.`
      );
    }
  }

  /**
   * Creates a TransactionId from an existing string.
   */
  public static from(value: string): TransactionId {
    return new TransactionId(value);
  }
}