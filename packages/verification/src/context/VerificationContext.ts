import type {
  ExecutionTrustRecord,
  Verification,
} from "@parmana/shared";

/**
 * Canonical Verification Context.
 */
export interface VerificationContext {
  trustRecord: ExecutionTrustRecord;

  verification?: Verification;

  verified: boolean;

  errors: readonly string[];
}