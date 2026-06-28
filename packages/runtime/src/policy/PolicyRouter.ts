import { readFileSync } from "fs";
import path from "path";

import type { Policy } from "@parmana/policy";
import { PolicyReference } from "@parmana/shared";

import { PolicyValidator } from "./PolicyValidator.js";

export class PolicyRouter {
  constructor(private readonly policyDir: string) {}

  load(reference: PolicyReference): Policy {
    const filePath = path.join(
      this.policyDir,
      reference.name,
      reference.version,
      "policy.json",
    );

    const policy = JSON.parse(
      readFileSync(filePath, "utf8"),
    ) as Policy;

    PolicyValidator.validate(reference, policy);

    return policy;
  }
}