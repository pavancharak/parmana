import {
  ErrorCode,
  ParmanaError,
} from "./ParmanaError.js";

/**
 * Raised when Runtime authorization fails.
 */
export class AuthorizationError extends ParmanaError {
  constructor(
    message: string,
    options?: {
      requestId?: string;
      cause?: unknown;
    },
  ) {
    super({
      code: ErrorCode.AUTHORIZATION_ERROR,

      message,

      ...(options?.requestId !== undefined && {
        requestId: options.requestId,
      }),

      ...(options?.cause !== undefined && {
        cause: options.cause,
      }),
    });

    this.name = "AuthorizationError";
  }
}
