import type { Policy } from "@parmana/policy";
import type { PolicyReference } from "@parmana/shared";

/**
 * Validates that a loaded policy artifact matches the
 * PolicyReference contained in the BusinessTransaction.
 */
export class PolicyValidator {
  static validate(
    reference: PolicyReference,
    policy: Policy,
  ): void {
    if (policy.policyId !== reference.name) {
      throw new Error(
        `Policy ID mismatch. Expected '${reference.name}', received '${policy.policyId}'.`,
      );
    }

    if (policy.policyVersion !== reference.version) {
      throw new Error(
        `Policy version mismatch. Expected '${reference.version}', received '${policy.policyVersion}'.`,
      );
    }

    if (policy.schemaVersion !== reference.schemaVersion) {
      throw new Error(
        `Policy schema version mismatch. Expected '${reference.schemaVersion}', received '${policy.schemaVersion}'.`,
      );
    }

    if (!policy.signalsSchema) {
      throw new Error("Policy is missing signalsSchema.");
    }

    if (!Array.isArray(policy.rules)) {
      throw new Error("Policy rules are missing or invalid.");
    }

    for (const rule of policy.rules) {
      if (!rule.id) {
        throw new Error("Policy rule is missing an id.");
      }

      if (!rule.condition) {
        throw new Error(`Policy rule '${rule.id}' is missing a condition.`);
      }

      if (!rule.outcome) {
        throw new Error(`Policy rule '${rule.id}' is missing an outcome.`);
      }
    }
  }
}