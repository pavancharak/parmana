import {
  BusinessTransactionRepository,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

import { ExecutionTrustApplication } from "./ExecutionTrustApplication.js";

import { Runtime } from "./Runtime.js";
import { RuntimeBuilder } from "./RuntimeBuilder.js";

import {
  ExecutionComponent,
  TrustChainValidationComponent,
} from "./components/index.js";

import { BusinessTransactionService } from "./services/business-transaction-service.js";
import { ExecutionService } from "./services/execution-service.js";
import { ReceiptService } from "./services/receipt-service.js";
import { VerificationService } from "./services/verification-service.js";

/**
 * Runtime Factory.
 *
 * Creates a fully configured
 * Execution Trust Application.
 */
export class RuntimeFactory {
  static create(
    transactions: BusinessTransactionRepository,
    trustRecords: ExecutionTrustRecordRepository,
  ): ExecutionTrustApplication {
    //
    // Application services
    //
    const transactionService = new BusinessTransactionService(transactions);

    const executionService = new ExecutionService(
      transactions,
      trustRecords,
    );

    const verificationService = new VerificationService(trustRecords);

    const receiptService = new ReceiptService(trustRecords);

    //
    // Runtime Pipeline
    //
    const runtime: Runtime = new RuntimeBuilder()
      .addStage(new TrustChainValidationComponent())
      .addStage(new ExecutionComponent(executionService))
      .build(trustRecords);

    //
    // Application
    //
    return new ExecutionTrustApplication(
      transactionService,
      runtime,
      verificationService,
      receiptService,
      trustRecords,
    );
  }
}