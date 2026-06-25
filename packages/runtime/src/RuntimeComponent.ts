import type { ExecutionTransaction } from "@parmana/shared";

/**
 * Represents a single deterministic stage in the Runtime Pipeline.
 *
 * Runtime components are stateless execution units that transform an
 * immutable ExecutionTransaction into a new immutable ExecutionTransaction.
 */
export interface RuntimeComponent {
  /**
   * Executes this runtime stage.
   *
   * @param transaction Immutable execution transaction.
   * @returns A new immutable execution transaction.
   */
  execute(
    transaction: ExecutionTransaction
  ): ExecutionTransaction;
}