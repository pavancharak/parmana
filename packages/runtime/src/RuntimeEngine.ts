
import { DecisionBuilder } from "./DecisionBuilder.js";
import { ExecutionBuilder } from "./ExecutionBuilder.js";
import { ExecutionGate } from "./ExecutionGate.js";

import {
  BusinessTransaction,
  BusinessTransactionStatus,
  ExecutionTrustRecord,
  JsonValue,
} from "@parmana/shared";

import {
  PolicyEngine,
  PolicyRouter,
} from "@parmana/policy";

import type { RuntimeContext } from "./context/RuntimeContext.js";
import { RuntimePipeline } from "./RuntimePipeline.js";
import { ExecutionTrustPipeline } from "./ExecutionTrustPipeline.js";

/**
 * Canonical Runtime Engine.
 *
 * Responsibilities:
 * - Load the requested policy.
 * - Evaluate the policy deterministically.
 * - Create the Decision artifact.
 * - Create the initial Execution artifact.
 * - Execute the Runtime Pipeline.
 * - Produce the Execution Trust Record.
 */
export class RuntimeEngine {
  constructor(
  private readonly pipeline: RuntimePipeline,
  private readonly policyRouter: PolicyRouter,
  private readonly policyEngine: PolicyEngine,
  private readonly decisionBuilder: DecisionBuilder,
  private readonly executionGate: ExecutionGate,
  private readonly executionBuilder: ExecutionBuilder,
  private readonly trustPipeline: ExecutionTrustPipeline,
) {
    if (!pipeline) {
      throw new Error("RuntimePipeline is required.");
    }

    if (!policyRouter) {
      throw new Error("PolicyRouter is required.");
    }

    if (!policyEngine) {
      throw new Error("PolicyEngine is required.");
    }

    if (!trustPipeline) {
      throw new Error("ExecutionTrustPipeline is required.");
    }
  }

  public async execute(
    transaction: BusinessTransaction,
  ): Promise<{
    transaction: BusinessTransaction;
    context: RuntimeContext;
    trustRecord: ExecutionTrustRecord;
  }> {
    //
    // Runtime signals
    //
    const signals =
      (transaction.signals ?? {}) as Record<
        string,
        JsonValue
      >;

    //
    // Load the exact policy referenced by the transaction.
    //
    const policy = await this.policyRouter.load(
      transaction.policy.name,
      transaction.policy.version,
    );

    //
    // Deterministic policy evaluation.
    //
    const policyDecision =
  this.policyEngine.evaluate(
    policy,
    signals,
  );

const decision =
  this.decisionBuilder.build(
    transaction,
    policyDecision,
  );
    //
    // Initial execution artifact.
    //
    this.executionGate.enforce(
  decision,
);

const execution =
  this.executionBuilder.build(
    transaction,
    decision,
  );

    //
    // Canonical Runtime Context.
    //
    const context: RuntimeContext = {
      transaction: {
        ...transaction,
        status:
          transaction.status ??
          BusinessTransactionStatus.RECEIVED,
      },
      decision,
      execution,
    };

    //
    // Execute runtime pipeline.
    //
    const processedContext =
      await this.pipeline.execute(context);

    //
    // Build Execution Trust Record.
    //
    const trustRecord =
      await this.trustPipeline.execute(
        processedContext,
      );

    return {
      transaction: processedContext.transaction,
      context: processedContext,
      trustRecord,
    };
  }

  /**
   * Returns true if the runtime pipeline is empty.
   */
  public isEmpty(): boolean {
    return this.pipeline.isEmpty();
  }

  /**
   * Returns the number of runtime stages.
   */
  public size(): number {
    return this.pipeline.size();
  }
}