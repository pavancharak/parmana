import path from "node:path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    "../../.env",
  ),
});

import {
  FilePolicyRepository,
} from "@parmana/policy";

import {
  RuntimeFactory,
} from "@parmana/runtime";

import type {
  ExecutionSystem,
} from "@parmana/execution-system";

import {
  businessTransactionRepository,
  executionTrustRecordRepository,
} from "./repositories.js";

export const policyRepository =
  new FilePolicyRepository(
    process.env.PARMANA_POLICY_DIR!,
  );

export function createApplication(
  executionSystem?: ExecutionSystem,
) {
  return RuntimeFactory.create(
    businessTransactionRepository,
    executionTrustRecordRepository,
    policyRepository,
    executionSystem,
  );
}

export const application =
  createApplication();