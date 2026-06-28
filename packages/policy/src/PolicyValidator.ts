import type { Policy } from "./types/Policy.js";

/**
 * Canonical Policy Validator.
 *
 * Validates the structural integrity of a Policy
 * before it is evaluated.
 */
export class PolicyValidator {
  /**
   * Validate a Policy.
   *
   * Throws if the policy is invalid.
   */
  public validate(policy: Policy): void {
    if (!policy) {
      throw new Error("Policy is required.");
    }

    if (!Array.isArray(policy.rules)) {
      throw new Error(
        "Policy rules must be an array.",
      );
    }

    if (policy.rules.length === 0) {
      throw new Error(
        "Policy must contain at least one rule.",
      );
    }

    for (const rule of policy.rules) {
      if (!rule.id) {
        throw new Error(
          "Policy rule id is required.",
        );
      }

      if (!rule.condition) {
        throw new Error(
          `Policy rule '${rule.id}' is missing a condition.`,
        );
      }

      if (!rule.outcome) {
        throw new Error(
          `Policy rule '${rule.id}' is missing an outcome.`,
        );
      }

      if (!rule.outcome.action) {
        throw new Error(
          `Policy rule '${rule.id}' is missing an outcome action.`,
        );
      }

      if (!rule.outcome.reason) {
        throw new Error(
          `Policy rule '${rule.id}' is missing an outcome reason.`,
        );
      }
    }
  }
}