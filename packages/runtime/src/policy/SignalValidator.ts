import type { PolicySignals } from "@parmana/policy";

/**
 * Validates runtime signals against a policy's
 * declared signalsSchema.
 */
export class SignalValidator {
  static validate(
    schema: Record<string, string>,
    signals: PolicySignals,
  ): void {
    for (const [name, expectedType] of Object.entries(schema)) {
      const value = signals[name];

      if (value === undefined) {
        throw new Error(`Missing required signal '${name}'.`);
      }

      const actualType = typeof value;

      if (actualType !== expectedType) {
        throw new Error(
          `Signal '${name}' expected '${expectedType}' but received '${actualType}'.`,
        );
      }
    }
  }
}