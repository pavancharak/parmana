import {
  BusinessTransactionRepository,
  ExecutionTrustRecordRepository,
  Override,
} from "@parmana/shared";

/**
 * Application service responsible for creating
 * authorized Override artifacts.
 *
 * Business rules:
 * - Business Transaction must exist.
 * - Only one accepted Override per Business Transaction.
 * - Override becomes part of the immutable
 *   Execution Trust Record.
 */
export class OverrideService {
  constructor(
    private readonly transactions: BusinessTransactionRepository,
    private readonly trustRecords: ExecutionTrustRecordRepository
  ) {}

  /**
   * Creates an authorized Override.
   */
  async create(
    businessTransactionId: string,
    approvedBy: string,
    reason: string,
    justification?: string
  ): Promise<Override> {

    //
    // 1. Verify Business Transaction exists
    //
    const transaction =
      await this.transactions.findById(
        businessTransactionId
      );

    if (!transaction) {
      throw new Error("Business Transaction not found.");
    }

    //
    // 2. Retrieve Trust Record
    //
    const trustRecord =
      await this.trustRecords.findByTransactionId(
        businessTransactionId
      );

    if (!trustRecord) {
      throw new Error("Execution Trust Record not found.");
    }

    //
    // 3. Enforce one Override rule
    //
    if (trustRecord.overrides.length > 0) {
      throw new Error(
        "Override already exists for this Business Transaction."
      );
    }

    //
    // NOTE:
    // Terminal execution checks should be added here
    // once execution lifecycle rules are implemented.
    //

    //
    // 4. Create immutable Override
    //
    const override: Override = {
  overrideId: crypto.randomUUID(),

  businessTransactionId,

  approvedBy,

  reason,

  ...(justification !== undefined
    ? { justification }
    : {}),

  approvedAt: new Date(),
};

    //
    // 5. Append to Trust Record
    //
    await this.trustRecords.appendOverride(
      businessTransactionId,
      override
    );

    return override;
  }
}