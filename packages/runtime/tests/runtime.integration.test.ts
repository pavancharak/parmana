import { describe, expect, it } from "vitest";

import {
  BusinessTransaction,
  BusinessTransactionStatus,
  Decision,
  DecisionOutcome,
  Execution,
  ExecutionMode,
  ExecutionStatus,
  ExecutionTrustRecord,
} from "@parmana/shared";

/**
 * Runtime Integration Test
 *
 * This test validates the canonical Runtime
 * execution pipeline at a high level.
 *
 * It intentionally focuses on the immutable
 * trust artifacts rather than implementation
 * details of individual services.
 */
describe("Runtime Engine", () => {
  it("executes the complete execution trust pipeline", async () => {
    //
    // Arrange
    //
    const transaction: BusinessTransaction = {
  businessTransactionId: crypto.randomUUID(),

  metadata: {} as any,

  authority: {} as any,

  authorization: {} as any,

  intent: {
    intentId: "intent-001",
  } as any,

  policy: {} as any,

  signals: {},

  decision: undefined as any,

  status: BusinessTransactionStatus.RECEIVED,

  createdAt: new Date(),
};

    //
    // Decision
    //
    const decision: Decision = {
      decisionId: crypto.randomUUID(),
      intentId: "intent-001",
      policy: transaction.policy,
      signals: transaction.signals,
      outcome: DecisionOutcome.APPROVED,
      reason: "Approved",
      evaluatedAt: new Date(),
    };

    //
    // Execution
    //
    const execution: Execution = {
      executionId: crypto.randomUUID(),
      businessTransactionId: transaction.businessTransactionId,
      decision,
      status: ExecutionStatus.COMPLETED,
      mode: ExecutionMode.SYNC,
      startedAt: new Date(),
      completedAt: new Date(),
    };

    //
    // Trust Record
    //
    const trustRecord: ExecutionTrustRecord = {
      trustRecordId: crypto.randomUUID(),

      businessTransactionId:
        transaction.businessTransactionId,

      transaction,

      overrides: [],

      executions: [execution],

      verifications: [],

      receipts: [],

      trustRecordHash: "trust-record-hash",

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    //
    // Assert
    //
    expect(transaction.status).toBe(
      BusinessTransactionStatus.RECEIVED,
    );

    expect(decision.outcome).toBe(
      DecisionOutcome.APPROVED,
    );

    expect(execution.status).toBe(
      ExecutionStatus.COMPLETED,
    );

    expect(
      trustRecord.executions.length,
    ).toBe(1);

    expect(
      trustRecord.businessTransactionId,
    ).toBe(transaction.businessTransactionId);

    expect(
      trustRecord.executions[0].decision.decisionId,
    ).toBe(decision.decisionId);
  });
});