import { VerificationEngine } from "./VerificationEngine.js";
import { VerificationPipeline } from "./VerificationPipeline.js";
import type { VerificationComponent } from "./VerificationComponent.js";

/**
 * Builder for immutable VerificationEngine instances.
 *
 * Responsible only for wiring the verification pipeline.
 */
export class VerificationBuilder {
  /**
   * Verification stages.
   */
  private readonly components: VerificationComponent[] = [];

  /**
   * Adds a verification stage.
   */
  public addStage(
    component: VerificationComponent,
  ): this {
    this.components.push(component);

    return this;
  }

  /**
   * Adds multiple verification stages.
   */
  public addStages(
    ...components: VerificationComponent[]
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
   * Builds an immutable VerificationEngine.
   */
  public build(): VerificationEngine {
    const pipeline =
      new VerificationPipeline(
        this.components,
      );

    return new VerificationEngine(
      pipeline,
    );
  }
}