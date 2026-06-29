import type { Policy } from "./types/Policy.js";
import { PolicyValidationError } from "./errors/PolicyValidationError.js";
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
  public validate(
    policy: Policy,
  ): void {
    if (!policy) {
      throw new PolicyValidationError("Policy is required.");
    }

    //
    // Identity
    //
    if (!policy.policyId?.trim()) {
      throw new PolicyValidationError(
        "policyId is required.",
      );
    }

    if (!policy.policyVersion?.trim()) {
      throw new PolicyValidationError(
        "policyVersion is required.",
      );
    }

    if (!policy.schemaVersion?.trim()) {
      throw new PolicyValidationError(
        "schemaVersion is required.",
      );
    }

    //
    // Rules
    //
    if (!Array.isArray(policy.rules)) {
      throw new PolicyValidationError(
        "Policy rules must be an array.",
      );
    }

    if (policy.rules.length === 0) {
      throw new PolicyValidationError(
        "Policy must contain at least one rule.",
      );
    }

    const ruleIds = new Set<string>();

    for (const rule of policy.rules) {
      if (!rule.id?.trim()) {
        throw new PolicyValidationError(
          "Policy rule id is required.",
        );
      }

      if (ruleIds.has(rule.id)) {
        throw new PolicyValidationError(
          `Duplicate policy rule id '${rule.id}'.`,
        );
      }

      ruleIds.add(rule.id);

      if (!rule.condition) {
        throw new PolicyValidationError(
          `Policy rule '${rule.id}' is missing a condition.`,
        );
      }

      if (!rule.outcome) {
        throw new PolicyValidationError(
          `Policy rule '${rule.id}' is missing an outcome.`,
        );
      }

      if (!rule.outcome.action?.trim()) {
        throw new PolicyValidationError(
          `Policy rule '${rule.id}' is missing an outcome action.`,
        );
      }

      if (
        rule.outcome.action !== "approve" &&
        rule.outcome.action !== "reject"
      ) {
        throw new PolicyValidationError(
          `Policy rule '${rule.id}' has an invalid action '${rule.outcome.action}'.`,
        );
      }

      if (!rule.outcome.reason?.trim()) {
        throw new PolicyValidationError(
          `Policy rule '${rule.id}' is missing an outcome reason.`,
        );
      }
    }
  }
}