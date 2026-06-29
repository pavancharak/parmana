import type { Policy } from "./types/Policy.js";
import type { PolicyRepository } from "./PolicyRepository.js";

import { PolicyValidator } from "./PolicyValidator.js";

/**
 * Loads exactly one policy.
 */
export class PolicyRouter {
  private readonly validator =
    new PolicyValidator();

  constructor(
    private readonly repository: PolicyRepository,
  ) {}

  public async load(
    name: string,
    version: string,
  ): Promise<Policy> {
    const policy =
      await this.repository.load(
        name,
        version,
      );

    this.validator.validate(
      policy,
    );

    return policy;
  }
}