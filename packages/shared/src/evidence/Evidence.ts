import { EvidenceArtifact } from "./EvidenceArtifact.js";

/**
 * Immutable collection of evidence artifacts.
 *
 * Evidence belongs to exactly one
 * ExecutionTransaction.
 */
export class Evidence {
  public readonly artifacts: readonly EvidenceArtifact[];

  constructor(
    artifacts: readonly EvidenceArtifact[] = []
  ) {
    this.artifacts = Object.freeze([...artifacts]);

    Object.freeze(this);
  }

  /**
   * Returns a new Evidence instance
   * containing an additional artifact.
   */
  public append(
    artifact: EvidenceArtifact
  ): Evidence {
    return new Evidence([
      ...this.artifacts,
      artifact,
    ]);
  }

  /**
   * Returns true if evidence exists.
   */
  public get isEmpty(): boolean {
    return this.artifacts.length === 0;
  }

  /**
   * Number of evidence artifacts.
   */
  public get size(): number {
    return this.artifacts.length;
  }

  public toJSON() {
    return {
      artifacts: this.artifacts,
    };
  }
}
