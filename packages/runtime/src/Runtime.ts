import crypto from "crypto";

import {
  BusinessTransaction,
  ExecutionTrustRecord,
  ExecutionTrustRecordRepository,
  DecisionOutcome,
  JsonValue,
} from "@parmana/shared";

import { RuntimePipeline } from "./RuntimePipeline.js";
import { RuntimeContext } from "./context/RuntimeContext.js";
import { ExecutionTrustPipeline } from "./ExecutionTrustPipeline.js";

/**
 * Parmana Runtime.
 *
 * Executes Business Transactions through pipeline + trust layer.
 */
export class Runtime {
  private readonly trustPipeline = new ExecutionTrustPipeline();

  constructor(
    private readonly pipeline: RuntimePipeline,
    private readonly trustRecords: ExecutionTrustRecordRepository,
  ) {
    Object.freeze(this);
  }

  public async execute(
    transaction: BusinessTransaction,
  ): Promise<ExecutionTrustRecord> {
    const signals = transaction.signals as Record<string, JsonValue>;

    const outcome =
      (signals?.riskScore as number) > 50
        ? DecisionOutcome.REJECTED
        : DecisionOutcome.APPROVED;

    let context: RuntimeContext = {
      transaction,
      decision: {
        decisionId: crypto.randomUUID(),
        intentId: transaction.intent.intentId,
        policy: transaction.policy,
        signals,
        outcome,
        reason: "runtime-evaluated",
        evaluatedAt: new Date(),
      },
    };

    context = await this.pipeline.execute(context);

    const trustRecord = await this.trustPipeline.execute(context);

    await this.trustRecords.create(trustRecord);

    return trustRecord;
  }

  public isEmpty(): boolean {
    return this.pipeline.isEmpty();
  }

  public size(): number {
    return this.pipeline.size();
  }
}