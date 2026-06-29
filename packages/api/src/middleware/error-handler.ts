import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  BusinessTransactionValidationError,
  DuplicateBusinessTransactionError,
  RuntimeError,
} from "@parmana/runtime";

import {
  PolicyNotFoundError,
  PolicyValidationError,
  SignalValidationError,
} from "@parmana/policy";

/**
 * Centralized API error handler.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  //
  // Request / validation errors
  //
  if (
    error instanceof BusinessTransactionValidationError ||
    error instanceof PolicyValidationError ||
    error instanceof SignalValidationError
  ) {
    res.status(400).json({
      error: error.message,
    });

    return;
  }

  //
  // Missing policy
  //
  if (error instanceof PolicyNotFoundError) {
    res.status(404).json({
      error: error.message,
    });

    return;
  }

  //
  // Duplicate transaction
  //
  if (
    error instanceof DuplicateBusinessTransactionError
  ) {
    res.status(409).json({
      error: error.message,
    });

    return;
  }

  //
  // Any Runtime exception
  //
  if (error instanceof RuntimeError) {
    res.status(error.status).json({
      error: error.message,
      code: error.code,
    });

    return;
  }

  //
  // Unexpected failure
  //
  console.error(error);

  res.status(500).json({
    error: "Internal Server Error",
  });
}