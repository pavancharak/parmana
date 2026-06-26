import { ParmanaError } from "./parmana-error.js";

export class ValidationError extends ParmanaError {
  constructor(message: string) {
    super(
      "VALIDATION_ERROR",
      message,
      400
    );
  }
}

