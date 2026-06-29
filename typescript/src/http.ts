import axios, { type AxiosInstance } from "axios";

/**
 * Create the HTTP client used by the Parmana SDK.
 */
export function createHttpClient(
  endpoint: string,
  apiKey?: string,
): AxiosInstance {
  return axios.create({
    baseURL: endpoint,
    headers: apiKey
      ? {
          Authorization: `Bearer ${apiKey}`,
        }
      : {},
    timeout: 30000,
  });
}