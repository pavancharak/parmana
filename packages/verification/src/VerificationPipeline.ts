import type { Verification } from "@parmana/shared";

import type { VerificationComponent } from "./VerificationComponent.js";

/**
 * Executes verification stages in deterministic order.
 */
export class VerificationPipeline {
  private readonly components: readonly VerificationComponent[];

  constructor(components: readonly VerificationComponent[]) {
    this.components = [...components];

    Object.freeze(this.components);
    Object.freeze(this);
  }

  public execute(verification: Verification): Verification {
    let current = verification;

    for (const component of this.components) {
      current = component.execute(current);
    }

    return current;
  }

  public getComponents(): readonly VerificationComponent[] {
    return this.components;
  }

  public size(): number {
    return this.components.length;
  }

  public isEmpty(): boolean {
    return this.components.length === 0;
  }
}
