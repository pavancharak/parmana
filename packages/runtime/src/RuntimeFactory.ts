import {
  BusinessTransactionRepository,
  ExecutionTrustRecordRepository,
} from "@parmana/shared";

import { Runtime } from "./Runtime.js";
import { RuntimeBuilder } from "./RuntimeBuilder.js";

import { ExecutionComponent } from "./components/ExecutionComponent.js";
import { VerificationComponent } from "./components/VerificationComponent.js";
import { ReceiptComponent } from "./components/ReceiptComponent.js";

import { ExecutionService } from "./services/execution-service.js";
import { VerificationService } from "./services/verification-service.js";
import { ReceiptService } from "./services/receipt-service.js";

/**
 * Runtime Factory.
 *
 * Creates a fully configured Runtime from the
 * supplied repository implementations.
 */
export class RuntimeFactory {
  static create(
    transactions: BusinessTransactionRepository,
    trustRecords: ExecutionTrustRecordRepository
  ): Runtime {

    const executionService =
      new ExecutionService(
        transactions,
        trustRecords
      );

    const verificationService =
      new VerificationService(
        trustRecords
      );

    const receiptService =
      new ReceiptService(
        trustRecords
      );

    return new RuntimeBuilder()
      .addStage(
        new ExecutionComponent(
          executionService
        )
      )
      .addStage(
        new VerificationComponent(
          verificationService
        )
      )
      .addStage(
        new ReceiptComponent(
          receiptService
        )
      )
      .build();
  }
}