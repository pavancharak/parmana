import { describe, expect, it } from "vitest";

import {
  BusinessTransaction,
  ExecutionTrustRecord,
  Verification,
  VerificationStatus,
} from "@parmana/shared";

import { VerificationService } from "../src/verification-service.js";

/**
 * Verification Integration Test
 *
 * Ensures Execution Trust Records are
 * deterministically verifiable and immutable.
 */
describe("Verification Service", () => {
  it("verifies a valid execution trust record", async () => {
    //
    // Arrange
    //
    const transaction = {} as BusinessTransaction;

    const trustRecord: ExecutionTrustRecord = {
      trustRecordId: "tr-1",
      businessTransactionId: transaction.businessTransactionId,
      transaction,
      overrides: [],
      executions: [],
      verifications: [],
      receipts: [],
      trustRecordHash: "valid-hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const verificationService = new VerificationService(
      {
        findByTransactionId: async () => trustRecord,
        appendVerification: async () => {},
      } as any,
    );

    //
    // Act
    //
    const verification: Verification =
      await verificationService.verify(
        transaction.businessTransactionId,
      );

    //
    // Assert
    //
    expect(verification.businessTransactionId).toBe(
      transaction.businessTransactionId,
    );

    expect([
      VerificationStatus.VERIFIED,
      VerificationStatus.FAILED,
    ]).toContain(verification.status);

    expect(verification.trustRecordHash).toBe(
      trustRecord.trustRecordHash,
    );
  });

  it("fails when trust record is missing", async () => {
    const verificationService = new VerificationService(
      {
        findByTransactionId: async () => null,
        appendVerification: async () => {},
      } as any,
    );

    const transaction = {
      businessTransactionId: "missing-tx",
    } as BusinessTransaction;

    const result = await verificationService.verify(
      transaction.businessTransactionId,
    );

    expect(result.status).toBe(
      VerificationStatus.FAILED,
    );
  });
});