import { Metadata } from "@parmana/shared";

/**
 * Infrastructure context for Runtime execution.
 *
 * RuntimeContext contains infrastructure configuration only.
 * It MUST NOT contain business state such as Authority,
 * Intent, Authorization, Execution, or Evidence.
 */
export class RuntimeContext {
  /**
   * Runtime metadata.
   */
  public readonly metadata: Metadata;

  constructor(
    metadata: Metadata = {
  traceId: "",
  source: "",
  createdAt: Date.now(),
}
  ) {
    this.metadata = metadata;

    Object.freeze(this);
  }

  /**
   * Returns a JSON representation.
   */
  public toJSON() {
    return {
      metadata: this.metadata,
    };
  }
}