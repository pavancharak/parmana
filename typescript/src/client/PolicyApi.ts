/**
 * Parmana SDK
 *
 * Policy API.
 *
 * Provides access to policy-related Runtime APIs.
 *
 * Responsibilities:
 * - Validate policies.
 * - Retrieve policy information.
 *
 * This API does NOT:
 * - execute transactions
 * - authorize execution
 * - verify trust records
 * - replay executions
 */

import type {
  Policy,
} from "@parmana/policy";

import type {
  Transport,
} from "../config/Transport.js";

/**
 * Canonical policy validation result.
 */
export interface PolicyValidationResult {
  /**
   * Indicates whether the policy is valid.
   */
  readonly valid: boolean;

  /**
   * Validation errors.
   */
  readonly errors: readonly string[];
}

/**
 * Policy API.
 */
export class PolicyApi {
  constructor(
    private readonly transport: Transport,
  ) {}

  /**
   * Validates a policy.
   */
  public async validate(
    policy: Policy,
  ): Promise<PolicyValidationResult> {
    const response =
      await this.transport.send<PolicyValidationResult>({
        path: "/policies/validate",

        method: "POST",

        body: policy,
      });

    return response.body;
  }
}