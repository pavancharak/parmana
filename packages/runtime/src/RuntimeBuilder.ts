import { Runtime } from "./Runtime.js";
import { RuntimePipeline } from "./RuntimePipeline.js";
import type { RuntimeComponent } from "./RuntimeComponent.js";

/**
 * Builder for immutable Runtime instances.
 *
 * The RuntimeBuilder configures the runtime pipeline.
 * RuntimeContext is execution-specific and therefore is
 * supplied when Runtime.execute(...) is called rather than
 * being stored in the Runtime itself.
 */
export class RuntimeBuilder {
  /**
   * Ordered runtime stages.
   */
  private readonly components: RuntimeComponent[] = [];

  /**
   * Adds a runtime stage.
   */
  public addStage(
    component: RuntimeComponent
  ): this {
    this.components.push(component);
    return this;
  }

  /**
   * Adds multiple runtime stages.
   */
  public addStages(
    ...components: RuntimeComponent[]
  ): this {
    this.components.push(...components);
    return this;
  }

  /**
   * Removes all configured stages.
   */
  public clearStages(): this {
    this.components.length = 0;
    return this;
  }

  /**
   * Builds an immutable Runtime.
   */
  public build(): Runtime {
    return new Runtime(
      new RuntimePipeline(this.components)
    );
  }
}