import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  BusinessTransaction,
  BusinessTransactionStatus,
} from "@parmana/shared";

import {
  FilePolicyRepository,
  PolicyEngine,
  PolicyRouter,
} from "@parmana/policy";

import { RuntimeEngine } from "../src/RuntimeEngine.js";
import { RuntimePipeline } from "../src/RuntimePipeline.js";
import { ExecutionTrustPipeline } from "../src/ExecutionTrustPipeline.js";

/**
 * RuntimeEngine End-to-End tests.
 */
describe("RuntimeEngine E2E", () => {
  const policyRepository = new FilePolicyRepository(
    path.resolve(process.cwd(), "../../policies"),
  );

  const policyRouter = new PolicyRouter(
    policyRepository,
  );

  const policyEngine = new PolicyEngine();

  const trustPipeline =
    new ExecutionTrustPipeline();

  it(
    "executes full trust pipeline deterministically",
    async () => {
      const transaction: BusinessTransaction = {
        businessTransactionId: "tx-1",

        metadata: {
          executionMode: "SYNC",
        } as any,

        authority: {} as any,

        authorization: {} as any,

        intent: {
          intentId: "intent-1",
        } as any,

        policy: {
          name: "vendor-payment",
          version: "1.0.0",
        },

        signals: {
          amount: 100,
          vendorVerified: true,
          paymentApproved: true,
        },

        status:
          BusinessTransactionStatus.RECEIVED,

        createdAt: new Date(),
      };

      const runtime = new RuntimeEngine(
        new RuntimePipeline([]),
        policyRouter,
        policyEngine,
        trustPipeline,
      );

      const result =
        await runtime.execute(transaction);

      expect(result.transaction).toBeDefined();
      expect(result.context).toBeDefined();
      expect(result.trustRecord).toBeDefined();

      expect(
        result.trustRecord.businessTransactionId,
      ).toBe(
        transaction.businessTransactionId,
      );
    },
  );

  it(
    "fails safely on invalid transaction",
    async () => {
      const runtime = new RuntimeEngine(
        new RuntimePipeline([]),
        policyRouter,
        policyEngine,
        trustPipeline,
      );

      await expect(
        runtime.execute(
          {} as BusinessTransaction,
        ),
      ).rejects.toThrow();
    },
  );
});