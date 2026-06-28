import crypto from "crypto";

import {
  BusinessTransaction,
  Decision,
  DecisionOutcome,
  Execution,
  ExecutionMode,
  ExecutionStatus,
  JsonValue,
} from "@parmana/shared";

import type { RuntimeContext } from "./context/RuntimeContext.js";
import { RuntimePipeline } from "./RuntimePipeline.js";
import { ExecutionTrustPipeline } from "./ExecutionTrustPipeline.js";

export class RuntimeEngine {
  private readonly trustPipeline = new ExecutionTrustPipeline();

  constructor(private readonly pipeline: RuntimePipeline) {
    if (!pipeline || typeof pipeline.execute !== "function") {
      throw new Error("Invalid RuntimePipeline: execute() missing");
    }
  }

  public async execute(
    transaction: BusinessTransaction,
  ): Promise<{
    transaction: BusinessTransaction;
    context: RuntimeContext;
    trustRecord: unknown;
  }> {
    const signals = (transaction.signals ?? {}) as Record<string, JsonValue>;

    const outcome =
      (signals.riskScore as number) > 50
        ? DecisionOutcome.REJECTED
        : DecisionOutcome.APPROVED;

    const decision: Decision = {
      decisionId: crypto.randomUUID(),
      intentId: transaction.intent.intentId,
      policy: transaction.policy,
      signals,
      outcome,
      reason: "runtime-evaluated",
      evaluatedAt: new Date(),
    };

    //
    // Initial execution artifact required by ExecutionTrustPipeline
    //
    const execution: Execution = {
      executionId: crypto.randomUUID(),
      businessTransactionId: transaction.businessTransactionId,
      decision,
      status: ExecutionStatus.PROCESSING,
      mode: ExecutionMode.SYNC,
      startedAt: new Date(),
    };

    //
    // Canonical Runtime Context
    //
    const context: RuntimeContext = {
      transaction: {
        ...transaction,
        status: "RECEIVED" as any,
      },
      decision,
      execution,
    };

    //
    // Execute runtime pipeline
    //
    const processedContext = await this.pipeline.execute(context);

    //
    // Build Execution Trust Record
    //
    const trustRecord =
      await this.trustPipeline.execute(processedContext);

    return {
      transaction: processedContext.transaction,
      context: processedContext,
      trustRecord,
    };
  }
}