/**
 * Base error for all Runtime-related failures.
 *
 * All Runtime exceptions should extend this class.
 */
export class RuntimeError extends Error {
  /**
   * Creates a new RuntimeError.
   *
   * @param message Error message.
   */
  constructor(message: string) {
    super(message);

    this.name = "RuntimeError";

    Object.setPrototypeOf(this, new.target.prototype);
  }
}