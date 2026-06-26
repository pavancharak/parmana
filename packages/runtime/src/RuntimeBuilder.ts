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

  public addStage(
    component: RuntimeComponent
  ): this {
    this.components.push(component);
    return this;
  }

  public addStages(
    ...components: RuntimeComponent[]
  ): this {
    this.components.push(...components);
    return this;
  }

  public clearStages(): this {
    this.components.length = 0;
    return this;
  }

  public build(): Runtime {
    return new Runtime(
      new RuntimePipeline(this.components)
    );
  }
}