import type {
  BusinessTransactionRepository,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

import type { StorageProvider } from "../StorageProvider.js";

import { SupabaseClientFactory } from "./SupabaseClientFactory.js";

import { SupabaseBusinessTransactionRepository } from "./SupabaseBusinessTransactionRepository.js";

import { SupabaseExecutionTrustRecordRepository } from "./SupabaseExecutionTrustRecordRepository.js";

/**
 * Supabase Storage Provider
 */
export class SupabaseStorageProvider implements StorageProvider {
  readonly businessTransactions: BusinessTransactionRepository;
  readonly trustRecords: ExecutionTrustRecordRepository;

  constructor() {
    const client = SupabaseClientFactory.create();

    this.businessTransactions =
      new SupabaseBusinessTransactionRepository(client);

    this.trustRecords =
      new SupabaseExecutionTrustRecordRepository(client);

    Object.freeze(this);
  }
}