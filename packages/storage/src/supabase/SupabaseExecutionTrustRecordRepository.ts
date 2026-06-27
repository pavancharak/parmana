import type {
  Execution,
  ExecutionTrustRecord,
  ExecutionTrustRecordRepository,
  Override,
  Receipt,
  Verification,
} from "@parmana/shared";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase implementation of
 * ExecutionTrustRecordRepository.
 */
export class SupabaseExecutionTrustRecordRepository implements ExecutionTrustRecordRepository {
  constructor(private readonly client: SupabaseClient) {
    Object.freeze(this);
  }

  /**
   * Creates a new Execution Trust Record.
   */
  async create(record: ExecutionTrustRecord): Promise<ExecutionTrustRecord> {
    const { error } = await this.client

      .from("execution_trust_records")

      .insert({
        trust_record_id: record.trustRecordId,

        business_transaction_id: record.businessTransactionId,

        transaction_json: record.transaction,

        trust_record_hash: record.trustRecordHash,

        created_at: record.createdAt,

        updated_at: record.updatedAt,
      });

    if (error) {
      throw new Error(
        `Failed to create Execution Trust Record: ${error.message}`,
      );
    }

    return record;
  }

  /**
   * Finds an Execution Trust Record.
   */
  async findByTransactionId(
    businessTransactionId: string,
  ): Promise<ExecutionTrustRecord | null> {
    const { data, error } = await this.client

      .from("execution_trust_records")

      .select("*")

      .eq("business_transaction_id", businessTransactionId)

      .single();

    if (error) {
      //
      // No matching Trust Record.
      //
      if (error.code === "PGRST116") {
        return null;
      }

      throw new Error(
        `Failed to load Execution Trust Record: ${error.message}`,
      );
    }

    return {
      trustRecordId: data.trust_record_id,

      businessTransactionId: data.business_transaction_id,

      transaction: data.transaction_json,

      //
      // TODO(v0.5)
      //
      // Hydrate immutable append-only
      // artifacts from:
      //
      // - executions
      // - overrides
      // - verifications
      // - receipts
      //
      // ordered by their canonical
      // timestamps.
      //
      executions: await this.loadExecutions(businessTransactionId),

      overrides: await this.loadOverrides(businessTransactionId),

      verifications: await this.loadVerifications(businessTransactionId),

      receipts: await this.loadReceipts(businessTransactionId),

      trustRecordHash: data.trust_record_hash,

      createdAt: new Date(data.created_at),

      updatedAt: new Date(data.updated_at),
    } as ExecutionTrustRecord;
  }

  /**
   * Appends an immutable Execution.
   */
  async appendExecution(
    businessTransactionId: string,
    execution: Execution,
  ): Promise<void> {
    const { error } = await this.client

      .from("executions")

      .insert({
        execution_id: execution.executionId,

        business_transaction_id: businessTransactionId,

        execution_json: execution,

        created_at: execution.startedAt,
      });

    if (error) {
      throw new Error(`Failed to append Execution: ${error.message}`);
    }
  }

  /**
   * @deprecated
   *
   * Parmana uses an append-only
   * execution model.
   *
   * This method exists only for
   * backward compatibility.
   *
   * New execution state transitions
   * must be represented by calling
   * appendExecution().
   */
  async replaceExecution(_execution: Execution): Promise<void> {
    throw new Error("replaceExecution() is deprecated. Use appendExecution().");
  }

  /**
   * Appends an immutable Override.
   */
  async appendOverride(
    businessTransactionId: string,
    override: Override,
  ): Promise<void> {
    const { error } = await this.client

      .from("overrides")

      .insert({
        override_id: override.overrideId,

        business_transaction_id: businessTransactionId,

        override_json: override,

        created_at: override.approvedAt,
      });

    if (error) {
      throw new Error(`Failed to append Override: ${error.message}`);
    }
  }

  /**
   * Appends an immutable Verification.
   */
  async appendVerification(
    businessTransactionId: string,
    verification: Verification,
  ): Promise<void> {
    const { error } = await this.client

      .from("verifications")

      .insert({
        verification_id: verification.verificationId,

        business_transaction_id: businessTransactionId,

        verification_json: verification,

        verified_at: verification.verifiedAt,
      });

    if (error) {
      throw new Error(`Failed to append Verification: ${error.message}`);
    }
  }

  /**
   * Appends an immutable Receipt.
   */
  async appendReceipt(
    businessTransactionId: string,
    receipt: Receipt,
  ): Promise<void> {
    const { error } = await this.client

      .from("receipts")

      .insert({
        receipt_id: receipt.receiptId,

        business_transaction_id: businessTransactionId,

        receipt_json: receipt,

        issued_at: receipt.issuedAt,
      });

    if (error) {
      throw new Error(`Failed to append Receipt: ${error.message}`);
    }
  }
  /**
   * Loads immutable Executions.
   */
  private async loadExecutions(
    businessTransactionId: string,
  ): Promise<readonly Execution[]> {
    const { data, error } = await this.client

      .from("executions")

      .select("*")

      .eq("business_transaction_id", businessTransactionId)

      .order("created_at", {
        ascending: true,
      });

    if (error) {
      throw new Error(`Failed to load Executions: ${error.message}`);
    }

    return (data ?? []).map((row) => row.execution_json as Execution);
  }
  /**
   * Loads immutable Overrides.
   */
  private async loadOverrides(
    businessTransactionId: string,
  ): Promise<readonly Override[]> {
    const { data, error } = await this.client

      .from("overrides")

      .select("*")

      .eq("business_transaction_id", businessTransactionId)

      .order("created_at", {
        ascending: true,
      });

    if (error) {
      throw new Error(`Failed to load Overrides: ${error.message}`);
    }

    return (data ?? []).map((row) => row.override_json as Override);
  }
  /**
   * Loads immutable Verifications.
   */
  private async loadVerifications(
    businessTransactionId: string,
  ): Promise<readonly Verification[]> {
    const { data, error } = await this.client

      .from("verifications")

      .select("*")

      .eq("business_transaction_id", businessTransactionId)

      .order("verified_at", {
        ascending: true,
      });

    if (error) {
      throw new Error(`Failed to load Verifications: ${error.message}`);
    }

    return (data ?? []).map((row) => row.verification_json as Verification);
  }

  /**
   * Loads immutable Receipts.
   */
  private async loadReceipts(
    businessTransactionId: string,
  ): Promise<readonly Receipt[]> {
    const { data, error } = await this.client

      .from("receipts")

      .select("*")

      .eq("business_transaction_id", businessTransactionId)

      .order("issued_at", {
        ascending: true,
      });

    if (error) {
      throw new Error(`Failed to load Receipts: ${error.message}`);
    }

    return (data ?? []).map((row) => row.receipt_json as Receipt);
  }
}
