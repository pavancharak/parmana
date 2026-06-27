import type {
  ExecutionTrustRecord,
} from "@parmana/shared";

/**
 * Verification Context.
 *
 * Mutable execution context used internally
 * while verifying an Execution Trust Record.
 *
 * This context never leaves the verification
 * package.
 */
export class VerificationContext {

  constructor(

    /**
     * Trust Record currently being verified.
     *
     * Optional until the verification package
     * is fully migrated to the Execution Trust
     * architecture.
     */
    public readonly trustRecord?:
      ExecutionTrustRecord,

    /**
     * Overall verification status.
     */
    public verified = true,

    /**
     * Verification errors collected by stages.
     */
    public readonly errors: string[] = []

  ) {}

}