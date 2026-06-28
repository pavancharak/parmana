export interface PolicyReference {
  /**
   * Policy identifier.
   */
  readonly name: string;

  /**
   * Business policy version.
   */
  readonly version: string;

  /**
   * Policy schema version.
   */
  readonly schemaVersion: string;
}