import {
  StorageFactory,
} from "@parmana/storage";

/**
 * Shared storage provider.
 *
 * Selected once during application startup.
 */
const storage =
  StorageFactory.createFromEnvironment();

/**
 * Shared repositories.
 *
 * Every API route uses these instances.
 */
export const businessTransactionRepository =
  storage.businessTransactions;

export const executionTrustRecordRepository =
  storage.trustRecords;