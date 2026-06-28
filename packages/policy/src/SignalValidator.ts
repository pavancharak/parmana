import type { PolicySignals } from "./types/PolicySignals.js";

/**
 * Canonical Signal Validator.
 *
 * Validates runtime signals before
 * PolicyEngine evaluation.
 *
 * Responsibility:
 * - Signals exist
 * - Signals are an object
 *
 * It does NOT evaluate business rules.
 */
export class SignalValidator {
  /**
   * Validate runtime signals.
   *
   * Throws if signals are invalid.
   */
  public validate(signals: PolicySignals): void {
    if (signals == null) {
      throw new Error("Policy signals are required.");
    }

    if (typeof signals !== "object") {
      throw new Error(
        "Policy signals must be an object.",
      );
    }

    if (Array.isArray(signals)) {
      throw new Error(
        "Policy signals cannot be an array.",
      );
    }
  }
}