import { RuntimeContext } from "./context/RuntimeContext.js";

import type { RuntimeComponent } from "./RuntimeComponent.js";

/**
 * Canonical Runtime Pipeline.
 *
 * Executes an ordered sequence of Runtime Components.
 *
 * Each Runtime Component receives an immutable RuntimeContext
 * and asynchronously returns the next RuntimeContext.
 *
 * The Runtime Pipeline performs orchestration only.
 * It contains no business logic.
 */
export class RuntimePipeline {
  /**
   * Ordered runtime stages.
   */
  private readonly components: readonly RuntimeComponent[];

  constructor(components: readonly RuntimeComponent[]) {
    this.components = [...components];

    Object.freeze(this.components);
    Object.freeze(this);
  }

  /**
   * Executes the configured runtime stages.
   */
  public async execute(context: RuntimeContext): Promise<RuntimeContext> {
    let current = context;

    for (const component of this.components) {
      current = await component.execute(current);
    }

    return current;
  }

  /**
   * Returns configured runtime stages.
   */
  public getComponents(): readonly RuntimeComponent[] {
    return this.components;
  }

  /**
   * Number of configured stages.
   */
  public size(): number {
    return this.components.length;
  }

  /**
   * Returns true when no stages exist.
   */
  public isEmpty(): boolean {
    return this.components.length === 0;
  }
}
