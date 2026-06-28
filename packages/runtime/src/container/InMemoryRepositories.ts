import {
  BusinessTransaction,
  Execution,
  ExecutionTrustRecord,
  Override,
  Receipt,
  Verification,
} from "@parmana/shared";

/**
 * In-memory BusinessTransaction store
 */
export class InMemoryBusinessTransactionRepo {
  private store = new Map<string, BusinessTransaction>();

  async findById(id: string) {
    return this.store.get(id) ?? null;
  }

  async create(tx: BusinessTransaction) {
    this.store.set(tx.businessTransactionId, tx);
    return tx;
  }

  async exists(id: string) {
    return this.store.has(id);
  }

  async list() {
    return Array.from(this.store.values());
  }
}

/**
 * In-memory ExecutionTrustRecord store
 */
export class InMemoryExecutionTrustRecordRepo {
  private store = new Map<string, ExecutionTrustRecord>();

  async findByTransactionId(id: string) {
    return this.store.get(id) ?? null;
  }

  async create(record: ExecutionTrustRecord) {
    this.store.set(record.businessTransactionId, record);
    return record;
  }

  async appendExecution(id: string, execution: Execution) {
    const existing = this.store.get(id);
    if (!existing) return;

    this.store.set(id, {
      ...existing,
      executions: [...existing.executions, execution],
      updatedAt: new Date(),
    });
  }

  async appendVerification(id: string, v: Verification) {
    const existing = this.store.get(id);
    if (!existing) return;

    this.store.set(id, {
      ...existing,
      verifications: [...existing.verifications, v],
      updatedAt: new Date(),
    });
  }

  async appendReceipt(id: string, r: Receipt) {
    const existing = this.store.get(id);
    if (!existing) return;

    this.store.set(id, {
      ...existing,
      receipts: [...existing.receipts, r],
      updatedAt: new Date(),
    });
  }

  async appendOverride(id: string, o: Override) {
    const existing = this.store.get(id);
    if (!existing) return;

    this.store.set(id, {
      ...existing,
      overrides: [...existing.overrides, o],
      updatedAt: new Date(),
    });
  }

  async replaceExecution(execution: Execution) {
    const existing = this.store.get(execution.businessTransactionId);
    if (!existing) return;

    this.store.set(execution.businessTransactionId, {
      ...existing,
      executions: existing.executions.map((e) =>
        e.executionId === execution.executionId ? execution : e
      ),
      updatedAt: new Date(),
    });
  }
}
export const sharedExecutionTrustRecordRepo =
  new InMemoryExecutionTrustRecordRepo();