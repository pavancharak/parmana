import { PolicyEngine } from "@parmana/policy";

export interface PolicyMeta {
  id: string;
  version: string;
  path: string;
}

export class PolicyRegistry {
  private readonly policies = new Map<string, PolicyMeta>();

  register(policy: PolicyMeta): void {
    this.policies.set(this.getKey(policy.id, policy.version), policy);
  }

  getPolicy(id: string, version?: string): PolicyEngine {
    const key = this.resolveKey(id, version);

    const meta = this.policies.get(key);

    if (!meta) {
      throw new Error(`Policy not found: ${id}:${version ?? "latest"}`);
    }

    return new PolicyEngine();
  }

  list(): PolicyMeta[] {
    return [...this.policies.values()];
  }

  private resolveKey(id: string, version?: string): string {
    if (version) {
      return this.getKey(id, version);
    }

    for (const key of this.policies.keys()) {
      if (key.startsWith(`${id}@`)) {
        return key;
      }
    }

    return `${id}@latest`;
  }

  private getKey(id: string, version: string): string {
    return `${id}@${version}`;
  }
}
