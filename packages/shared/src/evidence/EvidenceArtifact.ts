import { Metadata } from "../common/Metadata.js";
import { Timestamp } from "../common/Timestamp.js";
import { EvidenceType } from "./EvidenceType.js";

/**
 * A single immutable evidence artifact.
 */
export class EvidenceArtifact {
  public readonly type: EvidenceType;

  /**
   * Evidence payload.
   *
   * The shared package intentionally
   * does not constrain the schema.
   */
  public readonly payload: Readonly<Record<string, unknown>>;

  /**
   * Creation timestamp.
   */
  public readonly createdAt: Timestamp;

  /**
   * Optional metadata.
   */
  public readonly metadata: Metadata;

  constructor(
    type: EvidenceType,
    payload: Record<string, unknown>,
    createdAt: Timestamp = Timestamp.now(),
    metadata: Metadata = new Metadata()
  ) {
    this.type = type;
    this.payload = Object.freeze({ ...payload });
    this.createdAt = createdAt;
    this.metadata = metadata;

    Object.freeze(this);
  }

  public toJSON() {
    return {
      type: this.type,
      payload: this.payload,
      createdAt: this.createdAt,
      metadata: this.metadata,
    };
  }
}