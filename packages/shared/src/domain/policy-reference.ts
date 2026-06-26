/**
 * Parmana Trust Core
 *
 * Canonical Policy Reference
 *
 * Identifies the exact Policy used to evaluate
 * a Business Transaction.
 *
 * Policy References are immutable.
 */

export interface PolicyReference {
  /**
   * Policy name.
   *
   * Example:
   * payment-approval
   */
  readonly name: string;

  /**
   * Immutable policy version.
   *
   * Example:
   * 2.1.0
   */
  readonly version: string;

  /**
   * Version of the Signals schema expected
   * by this Policy.
   *
   * Example:
   * 1.0
   */
  readonly schemaVersion: string;
}
