/**
 * Parmana TypeScript SDK
 *
 * Example 05
 *
 * Human-in-the-Loop
 *
 * Demonstrates an authorized human override
 * becoming part of the immutable Execution
 * Trust Record.
 */

import {
  Authority,
  Authorization,
  BusinessTransaction,
  Execution,
  ExecutionTrustRecord,
  Intent,
  Override,
  PolicyReference,
} from "../src/index.js";

async function main(): Promise<void> {
  const authority: Authority = {
    authorityId: "authority-001",
    authorityName: "Acme Robotics",
    createdAt: new Date(),
  };

  const authorization: Authorization = {
    authorizationId: "authorization-001",
    authorityId: authority.authorityId,
    subject: "warehouse-robot-01",
    permissions: [
      "MOVE_PALLET",
    ],
    issuedAt: new Date(),
    expiresAt: new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ),
  };

  const intent: Intent = {
    intentId: "intent-001",
    authorizationId: authorization.authorizationId,
    operation: "MOVE_PALLET",
    target: "Restricted Zone",
    createdAt: new Date(),
  };

  const policy: PolicyReference = {
    policyName: "warehouse-policy",
    policyVersion: "1.0.0",
  };

  const transaction: BusinessTransaction = {
    businessTransactionId: "txn-001",
    authority,
    authorization,
    intent,
    policy,
    createdAt: new Date(),
  };

  const override: Override = {
    overrideId: "override-001",
    businessTransactionId:
      transaction.businessTransactionId,
    approvedBy: "operations-manager",
    reason:
      "Urgent customer shipment requires manual approval.",
    justification:
      "Customer escalation approved by warehouse supervisor.",
    approvedAt: new Date(),
  };

  const trustRecord = {
    trustRecordId: "trust-record-001",

    businessTransactionId:
      transaction.businessTransactionId,

    transaction,

    overrides: [
      override,
    ],

    executions: [] as Execution[],

    verifications: [],

    receipts: [],

    trustRecordHash:
      "3df9ef8d2cb14dc78eab1259d2fa4c91",

    createdAt: new Date(),

    updatedAt: new Date(),
  } satisfies ExecutionTrustRecord;

  console.log();
  console.log("======================================");
  console.log(" Parmana TypeScript SDK");
  console.log(" Example 05 - Human in the Loop");
  console.log("======================================");
  console.log();

  console.log("Business Transaction");
  console.log("------------------------------");
  console.log(
    "Transaction :",
    transaction.businessTransactionId,
  );
  console.log(
    "Operation   :",
    intent.operation,
  );
  console.log(
    "Target      :",
    intent.target,
  );

  console.log();

  console.log("Policy");
  console.log("------------------------------");
  console.log(
    "Policy Name :",
    policy.policyName,
  );
  console.log(
    "Version     :",
    policy.policyVersion,
  );

  console.log();

  console.log("Human Override");
  console.log("------------------------------");
  console.log(
    "Override ID :",
    override.overrideId,
  );
  console.log(
    "Approved By :",
    override.approvedBy,
  );
  console.log(
    "Reason      :",
    override.reason,
  );
  console.log(
    "Approved At :",
    override.approvedAt,
  );

  console.log();

  console.log("Execution Trust Record");
  console.log("------------------------------");
  console.log(
    "Trust Record :",
    trustRecord.trustRecordId,
  );
  console.log(
    "Overrides    :",
    trustRecord.overrides.length,
  );
  console.log(
    "Hash         :",
    trustRecord.trustRecordHash,
  );

  console.log();

  console.log("Trust Chain");
  console.log("------------------------------");
  console.log("✓ Authority");
  console.log("✓ Authorization");
  console.log("✓ Intent");
  console.log("✓ Policy Reference");
  console.log("✓ Human Override");
  console.log("✓ Execution Trust Record");

  console.log();

  console.log(
    "The override becomes an immutable part",
  );
  console.log(
    "of the Execution Trust Record and is",
  );
  console.log(
    "available for replay, verification,",
  );
  console.log(
    "and independent audit.",
  );

  console.log();
  console.log("Example completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});