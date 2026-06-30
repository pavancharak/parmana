/**
 * Parmana SDK
 *
 * Canonical HTTP transport.
 *
 * Responsibilities:
 * - Send HTTP requests.
 * - Serialize request bodies.
 * - Deserialize responses.
 * - Return canonical TransportResponse objects.
 *
 * This transport does NOT:
 * - evaluate policy
 * - authorize execution
 * - implement business logic
 */

import type {
  Transport,
  TransportRequest,
  TransportResponse,
} from "../config/Transport.js";

import type {
  Configuration,
} from "../config/Configuration.js";

import {
  NetworkError,
} from "../errors/NetworkError.js";

import {
  TimeoutError,
} from "../errors/TimeoutError.js";

export class HttpTransport
  implements Transport
{
  constructor(
    private readonly configuration: Configuration,
  ) {}

  public async send<T>(
    request: TransportRequest,
  ): Promise<TransportResponse<T>> {
    const controller =
      new AbortController();

    const timeout =
      this.configuration.timeout ??
      30_000;

    const timer = setTimeout(
      () => controller.abort(),
      timeout,
    );

    try {
      const init: RequestInit = {
        method: request.method,

        headers: {
          "Content-Type":
            "application/json",

          ...(request.headers ?? {}),
        },

        signal:
          controller.signal,
      };

      if (
        request.body !== undefined
      ) {
        init.body =
          JSON.stringify(
            request.body,
          );
      }

      const response =
        await fetch(
          this.configuration.endpoint +
            request.path,
          init,
        );

      clearTimeout(
        timer,
      );

      const headers: Record<
        string,
        string
      > = {};

      response.headers.forEach(
        (
          value,
          key,
        ) => {
          headers[key] = value;
        },
      );

      let body: T;

      if (
        response.status === 204
      ) {
        body = undefined as T;
      } else {
        body =
          (await response.json()) as T;
      }

      return {
        status:
          response.status,

        headers,

        body,
      };
    } catch (error) {
      clearTimeout(
        timer,
      );

      if (
        error instanceof DOMException &&
        error.name ===
          "AbortError"
      ) {
        throw new TimeoutError(
          "Request timed out.",
        );
      }

      throw new NetworkError(
        "Unable to communicate with the Parmana Runtime.",
        {
          cause: error,
        },
      );
    }
  }
}