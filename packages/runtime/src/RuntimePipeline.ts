import type { RuntimeContext } from "./context/RuntimeContext.js";
import type { RuntimeComponent } from "./RuntimeComponent.js";

export class RuntimePipeline {
  private readonly components: readonly RuntimeComponent[];

  constructor(components: readonly RuntimeComponent[]) {
    this.components = [...components];

    Object.freeze(this.components);
    Object.freeze(this);
  }

  public async execute(context: RuntimeContext): Promise<RuntimeContext> {
    let current = context;

    for (const component of this.components) {
      current = await component.execute(current);
    }

    return current;
  }

  public getComponents(): readonly RuntimeComponent[] {
    return this.components;
  }

  public size(): number {
    return this.components.length;
  }

  public isEmpty(): boolean {
    return this.components.length === 0;
  }
}