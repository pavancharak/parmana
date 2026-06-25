import { Metadata } from "@parmana/shared";

/**
 * Infrastructure context for verification execution.
 */
export class VerificationContext {
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

  public toJSON() {
    return {
      metadata: this.metadata,
    };
  }
}