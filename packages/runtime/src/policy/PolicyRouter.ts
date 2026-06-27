import { readFileSync, readdirSync } from "fs";

import path from "path";

import type { JsonValue } from "@parmana/shared";

import type { Policy, PolicyCondition } from "@parmana/policy";

import type { RuntimeTransaction } from "./types/RuntimeTransaction.js";

export class PolicyRouter {
  constructor(private readonly policyDir: string) {}

  route(tx: RuntimeTransaction): Policy {
    const policies = this.loadAllPolicies();

    for (const policy of policies) {
      if (this.evaluatePolicy(policy, tx)) {
        return policy;
      }
    }

    const fallback = policies.find((policy) =>
      policy.rules.some(
        (rule) => !rule.condition.all || rule.condition.all.length === 0,
      ),
    );

    if (fallback) {
      return fallback;
    }

    throw new Error("No matching policy found");
  }

  private loadAllPolicies(): Policy[] {
    const folders = readdirSync(this.policyDir);

    return folders.map((folder) => {
      const filePath = path.join(this.policyDir, folder, "policy.json");

      return JSON.parse(readFileSync(filePath, "utf8")) as Policy;
    });
  }

  private evaluatePolicy(policy: Policy, tx: RuntimeTransaction): boolean {
    return policy.rules.some((rule) => this.matches(rule.condition, tx));
  }

  private matches(condition: PolicyCondition, tx: RuntimeTransaction): boolean {
    if (!condition.all || condition.all.length === 0) {
      return true;
    }

    for (const c of condition.all) {
      if (c.signal && c.greater_than !== undefined) {
        const value = tx[c.signal as keyof RuntimeTransaction];

        if (typeof value !== "number" || value <= c.greater_than) {
          return false;
        }
      }

      if (c.signal && c.equals !== undefined) {
        const expected = c.equals as JsonValue;

        const actual = tx[c.signal as keyof RuntimeTransaction] as JsonValue;

        if (actual !== expected) {
          return false;
        }
      }
    }

    return true;
  }
}
