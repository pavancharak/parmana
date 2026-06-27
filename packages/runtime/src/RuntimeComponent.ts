import { RuntimeContext } from "./context/RuntimeContext.js";

/**
 * Runtime Component.
 *
 * Performs one deterministic operation on the
 * RuntimeContext.
 */
export interface RuntimeComponent {
  /**
   * Executes one runtime stage.
   */
  execute(context: RuntimeContext): Promise<RuntimeContext>;
}
