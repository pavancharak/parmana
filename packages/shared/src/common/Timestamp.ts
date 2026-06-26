/**
 * Immutable timestamp value object.
 *
 * Represents a single point in time using UTC.
 * Internally stores a JavaScript Date while exposing
 * deterministic ISO-8601 serialization.
 */
export class Timestamp {
  private readonly date: Date;

  private constructor(date: Date) {
    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid timestamp.");
    }

    this.date = new Date(date.getTime());
  }

  /**
   * Creates a timestamp from the current UTC time.
   */
  public static now(): Timestamp {
    return new Timestamp(new Date());
  }

  /**
   * Creates a timestamp from an ISO-8601 string.
   */
  public static fromISO(value: string): Timestamp {
    return new Timestamp(new Date(value));
  }

  /**
   * Creates a timestamp from an existing Date.
   */
  public static fromDate(date: Date): Timestamp {
    return new Timestamp(date);
  }

  /**
   * Returns a defensive copy of the Date.
   */
  public toDate(): Date {
    return new Date(this.date.getTime());
  }

  /**
   * Returns the canonical ISO-8601 UTC representation.
   */
  public toISOString(): string {
    return this.date.toISOString();
  }

  /**
   * Returns the Unix timestamp in milliseconds.
   */
  public toEpochMilliseconds(): number {
    return this.date.getTime();
  }

  /**
   * Compares two timestamps.
   */
  public equals(other: Timestamp): boolean {
    return this.date.getTime() === other.date.getTime();
  }

  /**
   * Returns true if this timestamp is before another.
   */
  public isBefore(other: Timestamp): boolean {
    return this.date.getTime() < other.date.getTime();
  }

  /**
   * Returns true if this timestamp is after another.
   */
  public isAfter(other: Timestamp): boolean {
    return this.date.getTime() > other.date.getTime();
  }

  /**
   * JSON serialization.
   */
  public toJSON(): string {
    return this.toISOString();
  }

  /**
   * String representation.
   */
  public toString(): string {
    return this.toISOString();
  }
}
