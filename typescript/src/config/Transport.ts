/**
 * Parmana SDK
 *
 * Canonical transport abstraction.
 *
 * A Transport is responsible only for sending requests
 * to the Parmana Runtime and returning responses.
 *
 * It does NOT:
 * - evaluate policy
 * - authorize execution
 * - perform verification
 * - perform replay
 * - implement business logic
 */

/**
 * Transport request.
 */
export interface TransportRequest {
  /**
   * Relative API path.
   *
   * Example:
   * /execute
   */
  readonly path: string;

  /**
   * HTTP method.
   */
  readonly method:
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

  /**
   * Optional request body.
   */
  readonly body?: unknown;

  /**
   * Optional request headers.
   */
  readonly headers?: Readonly<Record<string, string>>;
}

/**
 * Transport response.
 */
export interface TransportResponse<T = unknown> {
  /**
   * HTTP status code.
   */
  readonly status: number;

  /**
   * Response headers.
   */
  readonly headers: Readonly<Record<string, string>>;

  /**
   * Response body.
   */
  readonly body: T;
}

/**
 * Canonical SDK transport.
 */
export interface Transport {
  /**
   * Sends a request to the Parmana Runtime.
   */
  send<T = unknown>(
    request: TransportRequest,
  ): Promise<TransportResponse<T>>;
}