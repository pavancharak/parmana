import { ExecutionTrustRecord, Verification } from "@parmana/shared";

export interface VerificationEngine {
  verify(trustRecord: ExecutionTrustRecord): Promise<Verification>;
}
