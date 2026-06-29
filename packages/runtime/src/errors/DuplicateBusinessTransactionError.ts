import { RuntimeError } from "./RuntimeError.js";

/**
 * Thrown when attempting to create a Business Transaction
 * that already exists.
 */
export class DuplicateBusinessTransactionError extends RuntimeError {
  constructor(
    businessTransactionId: string,
  ) {
    super(
      `Business Transaction '${businessTransactionId}' already exists.`,
    );

    this.name =
      "DuplicateBusinessTransactionError";

    Object.setPrototypeOf(
      this,
      new.target.prototype,
    );
  }
}