import {
  ExecutionTrustRecord,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

/**
 * Application service responsible for retrieving
 * the canonical Execution Trust Record.
 *
 * The Trust Chain is a read-only projection of the
 * Execution Trust Record.
 */
export class TrustChainService {
  constructor(
    private readonly trustRecords: ExecutionTrustRecordRepository
  ) {}

  /**
   * Returns the canonical Execution Trust Record.
   */
  async get(
    businessTransactionId: string
  ): Promise<ExecutionTrustRecord> {

    const trustRecord =
      await this.trustRecords.findByTransactionId(
        businessTransactionId
      );

    if (!trustRecord) {
      throw new Error(
        "Execution Trust Record not found."
      );
    }

    return trustRecord;
  }
}