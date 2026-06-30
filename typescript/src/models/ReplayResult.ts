/**
 * Parmana TypeScript SDK
 *
 * Canonical ReplayResult.
 */

/**
 * Result of deterministic replay.
 */
export interface ReplayResult {
  /**
   * Indicates whether replay completed successfully.
   */
  readonly success: boolean;

  /**
   * Optional replay identifier.
   */
  readonly replayId?: string;

  /**
   * Optional replay message.
   */
  readonly message?: string;
}