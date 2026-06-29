/**
 * Parmana TypeScript SDK
 *
 * Example 02
 *
 * Verify Receipt
 */

import {
  ExecutionTrustRecord,
  ParmanaClient,
} from "../src/index.js";

async function main(): Promise<void> {
  const client = new ParmanaClient({
    endpoint: "http://localhost:8080",
  });

  /**
   * Placeholder Trust Record.
   *
   * In production this would be returned by the
   * Parmana Runtime after execution.
   */
  const trustRecord = {
    trustRecordId: "trust-record-001",
    businessTransactionId: "txn-001",

    transaction: {} as never,

    overrides: [],

    executions: [],

    verifications: [],

    receipts: [],

    trustRecordHash:
      "7f84e2d3c1d9d8d3d2c8f7e9b6a4c5d2",

    createdAt: new Date(),

    updatedAt: new Date(),
  } satisfies ExecutionTrustRecord;

  console.log();
  console.log("======================================");
  console.log(" Parmana TypeScript SDK");
  console.log(" Example 02 - Verify Receipt");
  console.log("======================================");
  console.log();

  console.log("Trust Record");
  console.log("-------------------------");
  console.log(
    "Trust Record ID :",
    trustRecord.trustRecordId,
  );
  console.log(
    "Transaction ID  :",
    trustRecord.businessTransactionId,
  );
  console.log(
    "Hash            :",
    trustRecord.trustRecordHash,
  );
  console.log();

  try {
    const verification =
      await client.verify(trustRecord);

    console.log("Verification");
    console.log("-------------------------");
    console.log(
      "Verification ID :",
      verification.verificationId,
    );
    console.log(
      "Status          :",
      verification.status,
    );
    console.log(
      "Verified At     :",
      verification.verifiedAt,
    );
  } catch (error) {
    console.log();
    console.error(
      "Verification service not available (expected during SDK development).",
    );

    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  console.log();
  console.log("Example completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});