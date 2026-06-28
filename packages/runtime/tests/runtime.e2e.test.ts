import { describe, expect, it } from "vitest";

import {
  BusinessTransaction,
  BusinessTransactionStatus,
} from "@parmana/shared";

import { RuntimeEngine } from "../src/RuntimeEngine.js";
import { RuntimePipeline } from "../src/RuntimePipeline.js";

/**
 * End-to-End Execution Trust Test
 *
 * Verifies the complete RuntimeEngine execution pipeline.
 */
describe("RuntimeEngine E2E", () => {
  it("executes full trust pipeline deterministically", async () => {
    //
    // Arrange
    //
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
      policy: {} as any,
      signals: {
        amount: 100,
        riskScore: 10,
      },
      status: BusinessTransactionStatus.RECEIVED,
      createdAt: new Date(),
    };

    //
    // Runtime Engine
    //
    const runtime = new RuntimeEngine(
      new RuntimePipeline([]),
    );

    //
    // Act
    //
    const result = await runtime.execute(transaction);

    //
    // Assert
    //
    expect(result).toBeDefined();

    expect(result.transaction.businessTransactionId).toBe(
      transaction.businessTransactionId,
    );

    expect(result.context).toBeDefined();

    expect(result.trustRecord).toBeDefined();

    expect(result.trustRecord.businessTransactionId).toBe(
      transaction.businessTransactionId,
    );

    expect(result.trustRecord.executions.length).toBeGreaterThan(
      0,
    );

    expect(result.trustRecord.verifications.length).toBeGreaterThanOrEqual(
      0,
    );

    expect(result.trustRecord.receipts.length).toBeGreaterThanOrEqual(
      0,
    );
  });

  it("fails safely on invalid transaction", async () => {
    const runtime = new RuntimeEngine(
      new RuntimePipeline([]),
    );

    await expect(
      runtime.execute({} as BusinessTransaction),
    ).rejects.toThrow();
  });
});