import type {
  BusinessTransactionRepository,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

import type {
  StorageProvider,
} from "../StorageProvider.js";

import {
  MemoryBusinessTransactionRepository,
} from "./MemoryBusinessTransactionRepository.js";

import {
  MemoryExecutionTrustRecordRepository,
} from "./MemoryExecutionTrustRecordRepository.js";

/**
 * Memory Storage Provider.
 *
 * Provides in-memory repository implementations
 * for development, testing, and local execution.
 */
export class MemoryStorageProvider
  implements StorageProvider {

  readonly businessTransactions:
    BusinessTransactionRepository;

  readonly trustRecords:
    ExecutionTrustRecordRepository;

  constructor() {

    this.businessTransactions =
      new MemoryBusinessTransactionRepository();

    this.trustRecords =
      new MemoryExecutionTrustRecordRepository();

    Object.freeze(this);

  }

}