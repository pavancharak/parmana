import path from "node:path";
import { readFile } from "node:fs/promises";

import type { Policy } from "./types/Policy.js";
import type { PolicyRepository } from "./PolicyRepository.js";

/**
 * File-based Policy Repository.
 *
 * Layout:
 *
 * policies/
 *   vendor-payment/
 *     1.0.0/
 *       policy.json
 */
export class FilePolicyRepository
  implements PolicyRepository
{
  constructor(
    private readonly basePath: string,
  ) {}

  public async load(
    name: string,
    version: string,
  ): Promise<Policy> {
    const file = path.join(
      this.basePath,
      name,
      version,
      "policy.json",
    );

    const json = await readFile(
      file,
      "utf8",
    );

    return JSON.parse(json) as Policy;
  }
}