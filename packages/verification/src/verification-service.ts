import crypto from "crypto";

import {
  Verification,
  VerificationStatus,
} from "@parmana/shared";

interface VerificationRepository {
  findByTransactionId(
    businessTransactionId: string,
  ): Promise<any | null>;

  appendVerification(
    verification: Verification,
  ): Promise<void>;
}

export class VerificationService {
  constructor(
    private readonly repository: VerificationRepository,
  ) {}

  public async verify(
    businessTransactionId: string,
  ): Promise<Verification> {
    const trustRecord =
      await this.repository.findByTransactionId(
        businessTransactionId,
      );

    if (!trustRecord) {
      return {
  verificationId: crypto.randomUUID(),
  businessTransactionId,
  trustRecordHash: "",
  status: VerificationStatus.FAILED,
  message: "Execution Trust Record not found.",
  verifiedAt: new Date(),
};
    }

    const verification: Verification = {
      verificationId: crypto.randomUUID(),
      businessTransactionId,
      trustRecordHash: trustRecord.trustRecordHash,
      status: VerificationStatus.VERIFIED,
      message: "Execution Trust Record verified successfully.",
      verifiedAt: new Date(),
    };

    await this.repository.appendVerification(
      verification,
    );

    return verification;
  }
}