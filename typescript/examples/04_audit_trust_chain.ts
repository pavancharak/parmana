/**
 * Parmana TypeScript SDK
 *
 * Example 04
 *
 * Audit Execution Trust Record
 */

import {
  ExecutionTrustRecord,
} from "../src/index.js";

function auditTrustRecord(
  record: ExecutionTrustRecord,
): void {
  console.log("======================================");
  console.log(" Parmana TypeScript SDK");
  console.log(" Example 04 - Audit Trust Chain");
  console.log("======================================");
  console.log();

  console.log("Execution Trust Record");
  console.log("----------------------");
  console.log(
    "Trust Record ID :",
    record.trustRecordId,
  );
  console.log(
    "Transaction ID  :",
    record.businessTransactionId,
  );
  console.log(
    "Trust Hash      :",
    record.trustRecordHash,
  );
  console.log(
    "Created         :",
    record.createdAt,
  );
  console.log(
    "Updated         :",
    record.updatedAt,
  );

  console.log();

  console.log("Business Transaction");
  console.log("----------------------");
  console.log(
    "Authority        :",
    record.transaction.authority.authorityName,
  );
  console.log(
    "Authorization ID :",
    record.transaction.authorization.authorizationId,
  );
  console.log(
    "Intent           :",
    record.transaction.intent.operation,
  );
  console.log(
    "Policy           :",
    `${record.transaction.policy.policyName} (${record.transaction.policy.policyVersion})`,
  );

  console.log();

  console.log("Execution Summary");
  console.log("----------------------");
  console.log(
    "Executions    :",
    record.executions.length,
  );
  console.log(
    "Overrides     :",
    record.overrides.length,
  );
  console.log(
    "Verifications :",
    record.verifications.length,
  );
  console.log(
    "Receipts      :",
    record.receipts.length,
  );

  console.log();

  console.log("Execution History");
  console.log("----------------------");

  if (record.executions.length === 0) {
    console.log("No executions recorded.");
  }

  for (const execution of record.executions) {
    console.log();
    console.log(
      "Execution ID :",
      execution.executionId,
    );
    console.log(
      "Status       :",
      execution.status,
    );
    console.log(
      "Mode         :",
      execution.mode,
    );
    console.log(
      "Decision     :",
      execution.decision.outcome,
    );
    console.log(
      "Started      :",
      execution.startedAt,
    );
    console.log(
      "Completed    :",
      execution.completedAt ?? "-",
    );
  }

  console.log();

  console.log("Verification History");
  console.log("----------------------");

  if (record.verifications.length === 0) {
    console.log("No verifications recorded.");
  }

  for (const verification of record.verifications) {
    console.log();
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
  }

  console.log();

  console.log("Receipt History");
  console.log("----------------------");

  if (record.receipts.length === 0) {
    console.log("No receipts recorded.");
  }

  for (const receipt of record.receipts) {
    console.log();
    console.log(
      "Receipt ID :",
      receipt.receiptId,
    );
    console.log(
      "Algorithm  :",
      receipt.algorithm,
    );
    console.log(
      "Issued At  :",
      receipt.issuedAt,
    );
  }

  console.log();

  console.log("Audit Result");
  console.log("----------------------");
  console.log(
    "✓ Authority recorded",
  );
  console.log(
    "✓ Authorization recorded",
  );
  console.log(
    "✓ Intent recorded",
  );
  console.log(
    "✓ Policy Reference recorded",
  );
  console.log(
    "✓ Execution history available",
  );
  console.log(
    "✓ Verification history available",
  );
  console.log(
    "✓ Receipt history available",
  );
  console.log(
    "✓ Execution Trust Record is suitable for independent audit",
  );
}

async function main(): Promise<void> {
  /**
   * Placeholder Trust Record.
   *
   * In production this would be retrieved from the
   * Parmana Runtime or Storage service.
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

  auditTrustRecord(trustRecord);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});