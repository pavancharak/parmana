import { Runtime } from "./Runtime.js";
import { RuntimeBuilder } from "./RuntimeBuilder.js";

/**
 * Runtime Factory.
 *
 * Creates canonical Runtime instances using the
 * RuntimeBuilder.
 */
export class RuntimeFactory {
  /**
   * Creates a Runtime with the default configuration.
   */
  static create(): Runtime {
    return new RuntimeBuilder().build();
  }
}