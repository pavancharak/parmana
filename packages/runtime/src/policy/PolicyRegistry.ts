import { PolicyEngine } from "@parmana/policy";

export interface PolicyMeta {
  id: string;
  version: string;
  path: string;
}

export class PolicyRegistry {
  private policies: Map<string, PolicyMeta> = new Map();

  register(policy: PolicyMeta) {
    const key = this.getKey(policy.id, policy.version);
    this.policies.set(key, policy);
  }

  getPolicy(id: string, version?: string): any {
    const key = this.resolveKey(id, version);
    const meta = this.policies.get(key);

    if (!meta) {
      throw new Error(`Policy not found: ${id}:${version || "latest"}`);
    }

    const engine = new PolicyEngine();
return engine;
  }

  list() {
    return Array.from(this.policies.values());
  }

  private resolveKey(id: string, version?: string) {
    if (version) return `${id}@${version}`;

    // fallback: pick latest registered version
    for (const key of this.policies.keys()) {
      if (key.startsWith(id + "@")) return key;
    }

    return `${id}@latest`;
  }

  private getKey(id: string, version: string) {
    return `${id}@${version}`;
  }
}