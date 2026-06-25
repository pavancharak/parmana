import { VerificationEngine } from "./VerificationEngine.js";
import { VerificationPipeline } from "./VerificationPipeline.js";
import type { VerificationComponent } from "./VerificationComponent.js";
import { VerificationContext } from "./context/VerificationContext.js";

/**
 * Builder for creating immutable VerificationEngine instances.
 */
export class VerificationBuilder {
  /**
   * Verification stages.
   */
  private readonly components: VerificationComponent[] = [];

  /**
   * Verification context.
   */
  private context: VerificationContext = new VerificationContext();

  /**
   * Adds a verification stage.
   *
   * @param component Verification stage.
   * @returns This builder.
   */
  public addStage(
    component: VerificationComponent
  ): this {
    this.components.push(component);
    return this;
  }

  /**
   * Adds multiple verification stages.
   *
   * @param components Verification stages.
   * @returns This builder.
   */
  public addStages(
    ...components: VerificationComponent[]
  ): this {
    this.components.push(...components);
    return this;
  }

  /**
   * Sets the verification context.
   *
   * @param context Verification context.
   * @returns This builder.
   */
  public withContext(
    context: VerificationContext
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
   * Builds an immutable VerificationEngine.
   *
   * @returns Configured verification engine.
   */
  public build(): VerificationEngine {
    const pipeline = new VerificationPipeline(
      this.components
    );

    return new VerificationEngine(
      pipeline,
      this.context
    );
  }
}