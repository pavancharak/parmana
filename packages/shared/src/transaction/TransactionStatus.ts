/**
 * Canonical lifecycle states for an ExecutionTransaction.
 *
 * The lifecycle is append-only. Transactions never move
 * backwards through the lifecycle.
 */
export const TransactionStatus = {
  NEW: "NEW",

  AUTHORITY_RECORDED: "AUTHORITY_RECORDED",

  INTENT_RECORDED: "INTENT_RECORDED",

  AUTHORIZED: "AUTHORIZED",

  EXECUTING: "EXECUTING",

  EXECUTED: "EXECUTED",

  EVIDENCE_RECORDED: "EVIDENCE_RECORDED",

  VERIFIED: "VERIFIED",

  COMPLETED: "COMPLETED",

  FAILED: "FAILED",

  CANCELLED: "CANCELLED",

  EXPIRED: "EXPIRED",
} as const;

/**
 * TransactionStatus type.
 */
export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];