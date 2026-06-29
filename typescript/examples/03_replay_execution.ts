/**
 * Parmana TypeScript SDK
 *
 * Example 03
 *
 * Replay Execution
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
   * Normally this would be retrieved from the
   * Parmana Runtime.
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
  console.log(" Example 03 - Replay Execution");
  console.log("======================================");
  console.log();

  console.log("Execution Trust Record");
  console.log("----------------------");
  console.log(
    "Trust Record ID :",
    trustRecord.trustRecordId,
  );
  console.log(
    "Transaction ID  :",
    trustRecord.businessTransactionId,
  );
  console.log(
    "Trust Hash      :",
    trustRecord.trustRecordHash,
  );
  console.log();

  console.log(
    "Starting deterministic replay...",
  );
  console.log();

  try {
    await client.replay(trustRecord);

    console.log(
      "Replay completed successfully.",
    );
  } catch (error) {
    console.log();
    console.error(
      "Replay service not available (expected during SDK development).",
    );

    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  console.log();
  console.log("Replay demonstrates that:");
  console.log(
    "• The original Business Transaction can be reconstructed.",
  );
  console.log(
    "• The same PolicyReference is used.",
  );
  console.log(
    "• The same runtime signals are evaluated.",
  );
  console.log(
    "• The same Decision is reproduced.",
  );
  console.log(
    "• The execution remains independently verifiable.",
  );

  console.log();
  console.log("Example completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});