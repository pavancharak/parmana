import { ExecutionTrustRecord } from "@parmana/shared";

export interface TrustRecordHasher {
  hash(trustRecord: ExecutionTrustRecord): Promise<string>;
}
