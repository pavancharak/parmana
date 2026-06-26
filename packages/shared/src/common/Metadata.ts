/**
 * Immutable metadata value object.
 *
 * Metadata provides extensible, non-semantic information
 * associated with domain objects.
 *
 * Metadata MUST NOT influence business decisions,
 * authorization, execution, or verification.
 */
export class Metadata {
  private readonly values: ReadonlyMap<string, string>;

  constructor(values: Record<string, string> = {}) {
    const entries = Object.entries(values);

    for (const [key, value] of entries) {
      if (!key.trim()) {
        throw new Error("Metadata key cannot be empty.");
      }

      if (value === undefined || value === null) {
        throw new Error(`Metadata value cannot be null: ${key}`);
      }
    }

    this.values = new Map(entries);
  }

  /**
   * Returns the metadata value.
   */
  public get(key: string): string | undefined {
    return this.values.get(key);
  }

  /**
   * Returns true if the key exists.
   */
  public has(key: string): boolean {
    return this.values.has(key);
  }

  /**
   * Returns all metadata as a plain object.
   */
  public toObject(): Readonly<Record<string, string>> {
    return Object.freeze(
      Object.fromEntries(this.values.entries())
    );
  }

  /**
   * Returns a new Metadata with an additional key/value.
   */
  public with(key: string, value: string): Metadata {
    const next = this.toObject();

    return new Metadata({
      ...next,
      [key]: value,
    });
  }

  /**
   * Returns a new Metadata without the specified key.
   */
  public without(key: string): Metadata {
    const next = this.toObject();

    delete (next as Record<string, string>)[key];

    return new Metadata(next);
  }

  /**
   * Compares two Metadata objects.
   */
  public equals(other: Metadata): boolean {
    const a = this.toObject();
    const b = other.toObject();

    return JSON.stringify(a) === JSON.stringify(b);
  }

  /**
   * JSON serialization.
   */
  public toJSON(): Readonly<Record<string, string>> {
    return this.toObject();
  }

  /**
   * Returns the number of metadata entries.
   */
  public get size(): number {
    return this.values.size;
  }
}
