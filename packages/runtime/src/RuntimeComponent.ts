import { RuntimeContext } from "./context/RuntimeContext.js";

/**
 * Runtime Component.
 *
 * A Runtime Component performs exactly one
 * deterministic operation on the RuntimeContext.
 *
 * Components should never mutate the supplied context.
 * They should return the next immutable RuntimeContext.
 */
export interface RuntimeComponent {
  /**
   * Executes one runtime stage.
   */
  execute(
    context: RuntimeContext
  ): RuntimeContext;
}