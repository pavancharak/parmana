/**
 * Parmana SDK
 *
 * Canonical SDK configuration.
 *
 * Configuration defines how the SDK communicates with
 * the Parmana Runtime.
 *
 * Configuration does NOT define:
 * - policy behavior
 * - runtime behavior
 * - authorization rules
 * - execution behavior
 * - verification behavior
 */

import type { Credentials } from "./Credentials.js";
import type { RetryPolicy } from "./RetryPolicy.js";
import type { Transport } from "./Transport.js";

/**
 * Immutable SDK configuration.
 */
export interface Configuration {
  /**
   * Parmana Runtime endpoint.
   *
   * Example:
   * https://runtime.example.com
   */
  readonly endpoint: string;

  /**
   * Authentication credentials.
   */
  readonly credentials?: Credentials;

  /**
   * Request timeout (milliseconds).
   *
   * Default:
   * 30000
   */
  readonly timeout?: number;

  /**
   * Retry configuration.
   */
  readonly retryPolicy?: RetryPolicy;

  /**
   * Transport implementation.
   *
   * If omitted, the SDK uses its default HTTP transport.
   */
  readonly transport?: Transport;

  /**
   * Optional SDK user agent.
   */
  readonly userAgent?: string;
}