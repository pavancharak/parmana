import {
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

import {
  PolicyEngine,
  PolicyRouter,
} from "@parmana/policy";

import type {
  PolicyRepository,
} from "@parmana/policy";

import { DecisionBuilder } from "./DecisionBuilder.js";
import { ExecutionBuilder } from "./ExecutionBuilder.js";
import { ExecutionGate } from "./ExecutionGate.js";

import { Runtime } from "./Runtime.js";
import { RuntimeEngine } from "./RuntimeEngine.js";
import { RuntimePipeline } from "./RuntimePipeline.js";
import { ExecutionTrustPipeline } from "./ExecutionTrustPipeline.js";

import type {
  RuntimeComponent,
} from "./RuntimeComponent.js";

/**
 * Canonical Runtime Builder.
 *
 * Responsible only for wiring the runtime.
 */
export class RuntimeBuilder {
  private readonly components: RuntimeComponent[] = [];

  private policyRepository?: PolicyRepository;

  /**
   * Configure policy directory.
   */
  public withPolicyRepository(
  repository: PolicyRepository,
): this {
  this.policyRepository = repository;

  return this;
}

  /**
   * Add runtime stage.
   */
  public addStage(
    component: RuntimeComponent,
  ): this {
    this.components.push(component);

    return this;
  }

  /**
   * Add multiple runtime stages.
   */
  public addStages(
    ...components: RuntimeComponent[]
  ): this {
    this.components.push(...components);

    return this;
  }

  /**
   * Remove all stages.
   */
  public clearStages(): this {
    this.components.length = 0;

    return this;
  }

  /**
   * Build immutable Runtime.
   */
  public build(
    trustRecords: ExecutionTrustRecordRepository,
  ): Runtime {
    //
    // Runtime pipeline
    //
    const pipeline =
      new RuntimePipeline(this.components);

    //
    // Policy subsystem
    //
    if (!this.policyRepository) {
  throw new Error(
    "PolicyRepository is required.",
  );
}

const router =
  new PolicyRouter(
    this.policyRepository,
  );

    const engine =
      new PolicyEngine();

    //
    // Trust subsystem
    //
    const trustPipeline =
      new ExecutionTrustPipeline();

    //
    // Runtime engine
    //
    const runtimeEngine =
  new RuntimeEngine(
    pipeline,
    router,
    engine,
    new DecisionBuilder(),
    new ExecutionGate(),
    new ExecutionBuilder(),
    trustPipeline,
  );

    //
    // Runtime façade
    //
    return new Runtime(
      runtimeEngine,
      trustRecords,
    );
  }
}