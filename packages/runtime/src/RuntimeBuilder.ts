import { Runtime } from "./Runtime.js";
import { RuntimePipeline } from "./RuntimePipeline.js";
import type { RuntimeComponent } from "./RuntimeComponent.js";
import { RuntimeContext } from "./context/RuntimeContext.js";

/**
 * Builder for creating immutable Runtime instances.
 */
export class RuntimeBuilder {
  /**
   * Runtime stages.
   */
  private readonly components: RuntimeComponent[] = [];

  /**
   * Runtime context.
   */
  private context: RuntimeContext = {} as RuntimeContext;

  /**
   * Adds a runtime stage.
   *
   * @param component Runtime stage.
   * @returns This builder.
   */
  public addStage(component: RuntimeComponent): this {
    this.components.push(component);
    return this;
  }

  /**
   * Adds multiple runtime stages.
   *
   * @param components Runtime stages.
   * @returns This builder.
   */
  public addStages(
    ...components: RuntimeComponent[]
  ): this {
    this.components.push(...components);
    return this;
  }

  /**
   * Sets the runtime context.
   *
   * @param context Runtime context.
   * @returns This builder.
   */
  public withContext(
    context: RuntimeContext
  ): this {
    this.context = context;
    return this;
  }

  /**
   * Removes all configured stages.
   *
   * @returns This builder.
   */
  public clearStages(): this {
    this.components.length = 0;
    return this;
  }

  /**
   * Builds an immutable Runtime.
   *
   * @returns Configured Runtime.
   */
  public build(): Runtime {
    const pipeline = new RuntimePipeline(this.components);

    return new Runtime(
      pipeline,
      this.context
    );
  }
}