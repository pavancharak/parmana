/**
 * Parmana Trust Core
 *
 * Execution Trust Receipt
 *
 * A cryptographically verifiable receipt proving the
 * outcome of an Execution Trust Record.
 *
 * Receipts are immutable trust artifacts generated
 * automatically by Parmana.
 */
export interface Receipt {
  /**
   * Unique Receipt identifier.
   */
  readonly receiptId: string;

  /**
   * Business Transaction represented by this Receipt.
   */
  readonly businessTransactionId: string;

  /**
   * Execution represented by this Receipt.
   *
   * Undefined when the Receipt represents the
   * latest transaction state.
   */
  readonly executionId?: string;

  /**
   * Hash of the Execution Trust Record.
   *
   * Used for independent verification.
   */
  readonly trustRecordHash: string;

  /**
   * Hash of this Receipt.
   */
  readonly receiptHash: string;

  /**
   * Digital signature over the Receipt.
   */
  readonly signature: string;

  /**
   * Signing algorithm.
   *
   * Example:
   * Ed25519
   */
  readonly algorithm: string;

  /**
   * UTC timestamp when the Receipt
   * was generated.
   */
  readonly issuedAt: Date;
}
