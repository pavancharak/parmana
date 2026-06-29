/**
 * Parmana SDK base error.
 */
export class ParmanaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParmanaError";
  }
}

/**
 * Runtime execution error.
 */
export class ExecutionError extends ParmanaError {
  constructor(message: string) {
    super(message);
    this.name = "ExecutionError";
  }
}

/**
 * Verification error.
 */
export class VerificationError extends ParmanaError {
  constructor(message: string) {
    super(message);
    this.name = "VerificationError";
  }
}

/**
 * Replay error.
 */
export class ReplayError extends ParmanaError {
  constructor(message: string) {
    super(message);
    this.name = "ReplayError";
  }
}