import path from "node:path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    "../../.env",
  ),
});
import { FilePolicyRepository } from "@parmana/policy";
import { RuntimeFactory } from "@parmana/runtime";

import {
  businessTransactionRepository,
  executionTrustRecordRepository,
} from "./repositories.js";

const policyRepository =
  new FilePolicyRepository(
    process.env.PARMANA_POLICY_DIR!,
  );
console.log(
  "PARMANA_POLICY_DIR =",
  process.env.PARMANA_POLICY_DIR,
);

export const application =
  RuntimeFactory.create(
    businessTransactionRepository,
    executionTrustRecordRepository,
    policyRepository,
  );