import crypto from "crypto";

import {
  ExecutionTrustRecord,
  Verification,
  VerificationStatus,
} from "@parmana/shared";

import type { VerificationContext } from "./context/VerificationContext.js";
import { VerificationPipeline } from "./VerificationPipeline.js";

/**
 * Canonical Verification Engine.
 *
 * Responsibilities:
 * - Create the VerificationContext.
 * - Execute the VerificationPipeline.
 * - Produce the Verification artifact.
 */
export class VerificationEngine {
  constructor(
    private readonly pipeline: VerificationPipeline,
  ) {
    if (!pipeline) {
      throw new Error(
        "VerificationPipeline is required.",
      );
    }
  }

  /**
   * Verify an Execution Trust Record.
   */
  public async verify(
    trustRecord: ExecutionTrustRecord,
  ): Promise<Verification> {
    //
    // Initial verification context
    //
    const context: VerificationContext = {
      trustRecord,
      verified: true,
      errors: [],
    };

    //
    // Execute verification pipeline
    //
    const result =
      await this.pipeline.execute(context);

    //
    // Produce Verification artifact
    //
    return {
      verificationId: crypto.randomUUID(),
      businessTransactionId:
        trustRecord.businessTransactionId,
      trustRecordHash:
        trustRecord.trustRecordHash,
      status: result.verified
        ? VerificationStatus.VERIFIED
        : VerificationStatus.FAILED,
      message: result.verified
        ? "Verification successful"
        : result.errors.join("; "),
      verifiedAt: new Date(),
    };
  }

  /**
   * True if no verification stages exist.
   */
  public isEmpty(): boolean {
    return this.pipeline.isEmpty();
  }

  /**
   * Number of verification stages.
   */
  public size(): number {
    return this.pipeline.size();
  }
}