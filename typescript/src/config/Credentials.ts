/**
 * Parmana SDK
 *
 * Canonical authentication credentials.
 *
 * Credentials identify the caller when communicating
 * with the Parmana Runtime.
 *
 * This model is transport-independent.
 */

/**
 * Supported authentication schemes.
 */
export enum AuthenticationScheme {
  API_KEY = "API_KEY",

  BEARER_TOKEN = "BEARER_TOKEN",
}

/**
 * Immutable SDK credentials.
 */
export interface Credentials {
  /**
   * Authentication scheme.
   */
  readonly scheme: AuthenticationScheme;

  /**
   * Credential value.
   */
  readonly value: string;
}