import type { Policy } from "./types/Policy.js";
import type { PolicyRepository } from "./PolicyRepository.js";

/**
 * Loads exactly one policy.
 */
export class PolicyRouter {
  constructor(
    private readonly repository: PolicyRepository,
  ) {}

  public async load(
    name: string,
    version: string,
  ): Promise<Policy> {
    return this.repository.load(
      name,
      version,
    );
  }
}