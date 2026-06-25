import { ExecutionTransaction } from "@parmana/shared";

/**
 * A runtime component performs one stage of execution.
 *
 * Components are deterministic and immutable.
 */
export interface RuntimeComponent {
  execute(
    transaction: ExecutionTransaction
  ): ExecutionTransaction;
}