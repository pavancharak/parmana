import type { VerificationContext } from "./context/VerificationContext.js";
import type { VerificationComponent } from "./VerificationComponent.js";

/**
 * Canonical Verification Pipeline.
 *
 * Executes verification stages in deterministic order.
 *
 * Guarantees:
 * - deterministic execution
 * - immutable VerificationContext
 * - fail-fast verification
 */
export class VerificationPipeline {
  private readonly components: readonly VerificationComponent[];

  constructor(
    components: readonly VerificationComponent[],
  ) {
    this.components = [...components];

    Object.freeze(this.components);
    Object.freeze(this);
  }

  /**
   * Execute the complete verification pipeline.
   */
  public async execute(
    context: VerificationContext,
  ): Promise<VerificationContext> {
    let current = context;

    for (const component of this.components) {
      current = await component.execute(current);
    }

    return current;
  }

  /**
   * Configured verification stages.
   */
  public getComponents(): readonly VerificationComponent[] {
    return this.components;
  }

  /**
   * Number of verification stages.
   */
  public size(): number {
    return this.components.length;
  }

  /**
   * True if no verification stages exist.
   */
  public isEmpty(): boolean {
    return this.components.length === 0;
  }
}