import type {
  ExecutionTrustRecord,
  Verification,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

/**
 * Verification Service.
 *
 * Orchestrates verification of an
 * Execution Trust Record.
 */
export class VerificationService {

  constructor(
    private readonly repository:
      ExecutionTrustRecordRepository
  ) {}

  async verify(
    businessTransactionId: string
  ): Promise<Verification> {

    const record =
      await this.repository.findByTransactionId(
        businessTransactionId
      );

    if (!record) {
      throw new Error(
        "Execution Trust Record not found."
      );
    }

    //
    // TODO:
    // Invoke Crypto
    // Invoke Verification Engine
    // Persist Verification
    //

    throw new Error(
      "Verification not implemented."
    );
  }
}