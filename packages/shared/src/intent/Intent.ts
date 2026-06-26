import { Metadata } from "../common/Metadata.js";

/**
 * Represents the expected outcome of an execution.
 *
 * Intent is immutable.
 */
export class Intent {
  /**
   * Human-readable action.
   *
   * Examples:
   *  - "payment.transfer"
   *  - "agent.respond"
   *  - "deployment.release"
   */
  public readonly action: string;

  /**
   * Structured execution parameters.
   */
  public readonly parameters: Readonly<Record<string, unknown>>;

  /**
   * Optional metadata.
   */
  public readonly metadata: Metadata;

  constructor(
    action: string,
    parameters: Record<string, unknown> = {},
    metadata: Metadata = new Metadata()
  ) {
    if (!action.trim()) {
      throw new Error("Intent action cannot be empty.");
    }

    this.action = action;
    this.parameters = Object.freeze({ ...parameters });
    this.metadata = metadata;

    Object.freeze(this);
  }

  public equals(other: Intent): boolean {
    return (
      this.action === other.action &&
      JSON.stringify(this.parameters) ===
        JSON.stringify(other.parameters)
    );
  }

  public toJSON() {
    return {
      action: this.action,
      parameters: this.parameters,
      metadata: this.metadata,
    };
  }
}
