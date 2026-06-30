import {
  ErrorCode,
  ParmanaError,
} from "./ParmanaError.js";

/**
 * Raised when Runtime authentication fails.
 */
export class AuthenticationError extends ParmanaError {
  constructor(
    message: string,
    options?: {
      requestId?: string;
      cause?: unknown;
    },
  ) {
    super({
      code: ErrorCode.AUTHENTICATION_ERROR,

      message,

      ...(options?.requestId !== undefined && {
        requestId: options.requestId,
      }),

      ...(options?.cause !== undefined && {
        cause: options.cause,
      }),
    });

    this.name = "AuthenticationError";
  }
}
