import {
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

    public readonly trustRecord:
      ExecutionTrustRecord,

    public verified = true,

    public readonly errors: string[] = []

  ) {}

}