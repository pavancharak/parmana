import type { ExecutionTransaction } from "@parmana/shared";

import type { RuntimeComponent } from "./RuntimeComponent.js";

/**
 * Executes a deterministic sequence of Runtime Components.
 *
 * The Runtime Pipeline is responsible only for orchestration.
 * It contains no business logic.
 */
export class RuntimePipeline {
  /**
   * Ordered pipeline stages.
   */
  private readonly components: readonly RuntimeComponent[];

  constructor(components: readonly RuntimeComponent[]) {
    this.components = [...components];

    Object.freeze(this.components);
    Object.freeze(this);
  }

  /**
   * Executes all runtime stages in order.
   *
   * @param transaction Initial execution transaction.
   * @returns Final execution transaction.
   */
  public execute(
    transaction: ExecutionTransaction
  ): ExecutionTransaction {
    let current = transaction;

    for (const component of this.components) {
      current = component.execute(current);
    }

    return current;
  }

  /**
   * Returns the configured runtime stages.
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
   * Returns true if no stages are configured.
   */
  public isEmpty(): boolean {
    return this.components.length === 0;
  }
}