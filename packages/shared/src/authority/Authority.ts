import { Metadata } from "../common/Metadata.js";

/**
 * Supported authority types.
 */
export const AuthorityType = {
  HUMAN: "HUMAN",
  AI_AGENT: "AI_AGENT",
  ORGANIZATION: "ORGANIZATION",
  SERVICE_ACCOUNT: "SERVICE_ACCOUNT",
  EXTERNAL_SYSTEM: "EXTERNAL_SYSTEM",
} as const;

export type AuthorityType =
  (typeof AuthorityType)[keyof typeof AuthorityType];

/**
 * Represents the authority responsible for authorizing execution.
 *
 * Authority is immutable.
 */
export class Authority {
  /**
   * Unique authority identifier.
   */
  public readonly id: string;

  /**
   * Display name.
   */
  public readonly name: string;

  /**
   * Authority classification.
   */
  public readonly type: AuthorityType;

  /**
   * Optional metadata.
   */
  public readonly metadata: Metadata;

  constructor(
    id: string,
    name: string,
    type: AuthorityType,
    metadata: Metadata = new Metadata()
  ) {
    if (!id.trim()) {
      throw new Error("Authority id cannot be empty.");
    }

    if (!name.trim()) {
      throw new Error("Authority name cannot be empty.");
    }

    this.id = id;
    this.name = name;
    this.type = type;
    this.metadata = metadata;

    Object.freeze(this);
  }

  /**
   * Equality based on identifier.
   */
  public equals(other: Authority): boolean {
    return this.id === other.id;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      metadata: this.metadata,
    };
  }
}
