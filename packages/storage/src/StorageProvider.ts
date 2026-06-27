import type {
  BusinessTransactionRepository,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

/**
 * Parmana Storage Provider.
 *
 * Exposes all repository implementations
 * for a storage backend.
 */
export interface StorageProvider {
  /**
   * Business Transaction repository.
   */
  readonly businessTransactions: BusinessTransactionRepository;

  /**
   * Execution Trust Record repository.
   */
  readonly trustRecords: ExecutionTrustRecordRepository;
}
