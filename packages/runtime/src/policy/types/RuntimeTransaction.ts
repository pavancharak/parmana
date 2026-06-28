import type { JsonValue } from "@parmana/shared";

/**
 * Generic runtime transaction presented to the policy engine.
 *
 * The runtime does not assume any business domain.
 * Policies evaluate arbitrary runtime signals.
 */
export interface RuntimeTransaction {
  /**
   * Runtime signals supplied to the selected policy.
   */
  readonly signals: Record<string, JsonValue>;
}