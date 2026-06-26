import { readFileSync, readdirSync } from "fs";
import path from "path";

export class PolicyRouter {
  constructor(private policyDir: string) {}

  route(tx: any) {
    const policies = this.loadAllPolicies();

    // 1. FIRST MATCH WINS
    for (const policy of policies) {
      if (this.evaluatePolicy(policy, tx)) {
        return policy;
      }
    }

    // 2. FALLBACK: "all match" policy
    const fallback = policies.find(
      (p) =>
        p.rules?.some(
          (r: any) =>
            !r.condition?.all || r.condition.all.length === 0
        )
    );

    if (fallback) {
      return fallback;
    }

    throw new Error("No matching policy found");
  }

  private loadAllPolicies() {
    const folders = readdirSync(this.policyDir);

    return folders.map((folder) => {
      const filePath = path.join(this.policyDir, folder, "policy.json");
      return JSON.parse(readFileSync(filePath, "utf-8"));
    });
  }

  private evaluatePolicy(policy: any, tx: any): boolean {
    for (const rule of policy.rules) {
      if (this.matches(rule.condition, tx)) {
        return true;
      }
    }
    return false;
  }

  private matches(condition: any, tx: any): boolean {
    // "all: []" means ALWAYS match
    if (!condition?.all || condition.all.length === 0) {
      return true;
    }

    for (const c of condition.all) {
      if (c.greater_than !== undefined) {
        if (tx[c.signal] <= c.greater_than) return false;
      }

      if (c.equals !== undefined) {
  const keys = Object.keys(c.equals);

  if (keys.length === 0) return false;

  const key = keys[0];

  if (!key) return false;

  const expectedValue = (c.equals as Record<string, any>)[key];
  const actualValue = (tx as Record<string, any>)[key];

  if (actualValue !== expectedValue) return false;
}
    }

    return true;
  }
}