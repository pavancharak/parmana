/**
 * Execution Authorization
 *
 * Proof that Parmana authorized a specific
 * execution request.
 *
 * Enterprise systems should execute only
 * requests carrying a valid ExecutionAuthorization.
 */
export interface ExecutionAuthorization {
  /**
   * Unique authorization identifier.
   */
  readonly authorizationId: string;

  /**
   * Approved Decision.
   */
  readonly decisionId: string;

  /**
   * Business Transaction.
   */
  readonly businessTransactionId: string;

  /**
   * Time authorization was issued.
   */
  readonly authorizedAt: Date;

  /**
   * Optional expiry.
   */
  readonly expiresAt?: Date;
}