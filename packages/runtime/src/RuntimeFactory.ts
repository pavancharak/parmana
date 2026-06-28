import type { PolicyRepository } from "@parmana/policy";

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
 * Canonical Runtime Factory.
 *
 * Creates a fully configured
 * Execution Trust Application.
 */
export class RuntimeFactory {
  public static create(
    transactions: BusinessTransactionRepository,
    trustRecords: ExecutionTrustRecordRepository,
    policyRepository: PolicyRepository,
  ): ExecutionTrustApplication {
    //
    // Application Services
    //
    const transactionService =
      new BusinessTransactionService(
        transactions,
      );

    const executionService =
      new ExecutionService(
        transactions,
        trustRecords,
      );

    const verificationService =
      new VerificationService(
        trustRecords,
      );

    const receiptService =
      new ReceiptService(
        trustRecords,
      );

    //
    // Runtime
    //
    const runtime: Runtime =
      new RuntimeBuilder()
        .withPolicyRepository(
          policyRepository,
        )
        .addStage(
          new TrustChainValidationComponent(),
        )
        .addStage(
          new ExecutionComponent(
            executionService,
          ),
        )
        .build(
          trustRecords,
        );

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