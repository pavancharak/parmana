import type { ExecutionTrustRecordRepository } from "@parmana/shared";

export class SupabaseExecutionTrustRecordRepository implements ExecutionTrustRecordRepository {
  constructor(private client: any) {}

  async create(record: any) {
    return record;
  }

  async appendExecution() {}

  async replaceExecution() {}

  async appendOverride() {}

  async appendVerification() {}

  async appendReceipt() {}

  async findByTransactionId() {
    return null;
  }
}