import {
  BusinessTransaction,
  ExecutionMode,
  ExecutionTrustRecord,
} from "@parmana/shared";

import { RuntimeContext } from "./context/RuntimeContext.js";

import { ExecutionService } from "./services/execution-service.js";
import { VerificationService } from "./services/verification-service.js";
import { ReceiptService } from "./services/receipt-service.js";

import { ExecutionTrustPipeline } from "./ExecutionTrustPipeline.js";

/**
 * Runtime Orchestrator.
 *
 * Coordinates the complete Execution Trust workflow.
 *
 * BusinessTransaction
 *        |
 *        v
 * Execution
 *        |
 *        v
 * Verification
 *        |
 *        v
 * Receipt
 *        |
 *        v
 * Execution Trust Record
 */
export class RuntimeOrchestrator {
  constructor(
    private readonly executionService: ExecutionService,
    private readonly verificationService: VerificationService,
    private readonly receiptService: ReceiptService,
    private readonly pipeline: ExecutionTrustPipeline
  ) {
    Object.freeze(this);
  }

  /**
   * Executes the complete Execution Trust workflow.
   */
  public async execute(
    transaction: BusinessTransaction
  ): Promise<ExecutionTrustRecord> {
    let context: RuntimeContext = {
      transaction,
    };

    //
    // 1. Create Execution
    //
    const execution =
      await this.executionService.create(
        transaction.businessTransactionId,
        ExecutionMode.SYNC
      );

    context = {
      ...context,
      execution,
    };

    //
    // 2. Verify Execution Trust Record
    //
    const verification =
      await this.verificationService.verify(
        transaction.businessTransactionId
      );

    context = {
      ...context,
      verification,
    };

    //
    // 3. Generate Receipt
    //
    const receipt =
      await this.receiptService.generate(
        transaction.businessTransactionId
      );

    context = {
      ...context,
      receipt,
    };

    //
    // 4. Assemble the canonical Execution Trust Record
    //
    return this.pipeline.execute(context);
  }
}