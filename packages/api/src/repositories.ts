import {
  MemoryBusinessTransactionRepository,
  MemoryExecutionTrustRecordRepository,
} from "@parmana/storage";

/**
 * Shared repositories.
 *
 * Every API route uses these instances.
 */

export const businessTransactionRepository =
  new MemoryBusinessTransactionRepository();

export const executionTrustRecordRepository =
  new MemoryExecutionTrustRecordRepository();