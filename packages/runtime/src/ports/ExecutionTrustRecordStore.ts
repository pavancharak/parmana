import { ExecutionTrustRecord } from "@parmana/shared";

export interface ExecutionTrustRecordStore {
  save(trustRecord: ExecutionTrustRecord): Promise<void>;

  findByBusinessTransactionId(
    businessTransactionId: string,
  ): Promise<ExecutionTrustRecord | null>;
}
