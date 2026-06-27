import { ExecutionTrustRecordRepository } from "@parmana/shared";

import { Runtime } from "./Runtime.js";
import { RuntimePipeline } from "./RuntimePipeline.js";
import type { RuntimeComponent } from "./RuntimeComponent.js";

/**
 * Builder for immutable Runtime instances.
 *
 * The RuntimeBuilder configures the runtime pipeline.
 */
export class RuntimeBuilder {
  private readonly components: RuntimeComponent[] = [];

  /**
   * Adds a Runtime stage.
   */
  public addStage(component: RuntimeComponent): this {
    this.components.push(component);

    return this;
  }

  /**
   * Adds multiple Runtime stages.
   */
  public addStages(...components: RuntimeComponent[]): this {
    this.components.push(...components);

    return this;
  }

  /**
   * Removes all Runtime stages.
   */
  public clearStages(): this {
    this.components.length = 0;

    return this;
  }

  /**
   * Builds an immutable Runtime.
   */
  public build(trustRecords: ExecutionTrustRecordRepository): Runtime {
    return new Runtime(
      new RuntimePipeline(this.components),

      trustRecords,
    );
  }
}
