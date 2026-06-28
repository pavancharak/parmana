import type {
  BusinessTransaction,
  BusinessTransactionRepository,
} from "@parmana/shared";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase implementation of
 * BusinessTransactionRepository.
 *
 * This repository persists only the canonical
 * BusinessTransaction domain model.
 *
 * Decision, Execution, Receipt and Verification
 * are persisted independently as downstream
 * execution artifacts.
 */
export class SupabaseBusinessTransactionRepository
  implements BusinessTransactionRepository
{
  constructor(private readonly client: SupabaseClient) {
    Object.freeze(this);
  }

  /**
   * Creates a new Business Transaction.
   */
  async create(
    transaction: BusinessTransaction,
  ): Promise<BusinessTransaction> {
    const { error } = await this.client
      .from("business_transactions")
      .insert({
        business_transaction_id: transaction.businessTransactionId,

        status: transaction.status,

        authority_json: transaction.authority,

        authorization_json: transaction.authorization,

        intent_json: transaction.intent,

        metadata_json: transaction.metadata,

        policy_json: transaction.policy,

        signals_json: transaction.signals,

        created_at: transaction.createdAt,
      });

    if (error) {
      throw new Error(
        `Failed to create Business Transaction: ${error.message}`,
      );
    }

    return transaction;
  }

  /**
   * Finds a Business Transaction.
   */
  async findById(
    businessTransactionId: string,
  ): Promise<BusinessTransaction | null> {
    const { data, error } = await this.client
      .from("business_transactions")
      .select("*")
      .eq("business_transaction_id", businessTransactionId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }

      throw new Error(
        `Failed to load Business Transaction: ${error.message}`,
      );
    }

    return {
      businessTransactionId: data.business_transaction_id,

      authority: data.authority_json,

      authorization: data.authorization_json,

      intent: data.intent_json,

      metadata: data.metadata_json,

      policy: data.policy_json,

      signals: data.signals_json,

      status: data.status,

      createdAt: new Date(data.created_at),
    } as BusinessTransaction;
  }

  /**
   * Checks whether a Business Transaction exists.
   */
  async exists(
    businessTransactionId: string,
  ): Promise<boolean> {
    const { count, error } = await this.client
      .from("business_transactions")
      .select("*", {
        head: true,
        count: "exact",
      })
      .eq("business_transaction_id", businessTransactionId);

    if (error) {
      throw new Error(
        `Failed to check Business Transaction existence: ${error.message}`,
      );
    }

    return (count ?? 0) > 0;
  }

  /**
   * Lists Business Transactions.
   */
  async list(
    page: number,
    pageSize: number,
  ): Promise<readonly BusinessTransaction[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await this.client
      .from("business_transactions")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (error) {
      throw new Error(
        `Failed to list Business Transactions: ${error.message}`,
      );
    }

    return (data ?? []).map(
      (row) =>
        ({
          businessTransactionId: row.business_transaction_id,

          authority: row.authority_json,

          authorization: row.authorization_json,

          intent: row.intent_json,

          metadata: row.metadata_json,

          policy: row.policy_json,

          signals: row.signals_json,

          status: row.status,

          createdAt: new Date(row.created_at),
        }) as BusinessTransaction,
    );
  }
}