/**
 * Parmana TypeScript SDK
 *
 * Example 10
 *
 * Custom Policy
 *
 * Demonstrates explicit PolicyReference selection.
 *
 * The BusinessTransaction specifies exactly which
 * policy version must be evaluated.
 *
 * The Runtime never discovers or chooses policies.
 */

import {
  Authority,
  Authorization,
  BusinessTransaction,
  DecisionOutcome,
  Execution,
  ExecutionMode,
  ExecutionStatus,
  ExecutionTrustRecord,
  Intent,
  ParmanaClient,
  PolicyReference,
} from "../src/index.js";

async function main(): Promise<void> {
  const client = new ParmanaClient({
    endpoint: "http://localhost:8080",
  });

  const authority: Authority = {
    authorityId: "authority-001",
    authorityName: "Acme Manufacturing",
    createdAt: new Date(),
  };

  const authorization: Authorization = {
    authorizationId: "authorization-001",
    authorityId: authority.authorityId,
    subject: "manufacturing-controller",
    permissions: [
      "START_PRODUCTION",
    ],
    issuedAt: new Date(),
    expiresAt: new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000,
    ),
  };

  const intent: Intent = {
    intentId: "intent-001",
    authorizationId: authorization.authorizationId,
    operation: "START_PRODUCTION",
    target: "BATCH-2026-001",
    createdAt: new Date(),
  };

  /**
   * Explicit policy selection.
   *
   * This policy becomes part of the immutable
   * execution trust chain.
   */
  const policy: PolicyReference = {
    policyName: "manufacturing-production-policy",
    policyVersion: "2.3.1",
  };

  const transaction: BusinessTransaction = {
    businessTransactionId: "production-001",
    authority,
    authorization,
    intent,
    policy,
    createdAt: new Date(),
  };

  const execution: Execution = {
    executionId: "execution-001",

    businessTransactionId:
      transaction.businessTransactionId,

    decision: {
      decisionId: "decision-001",

      intentId: intent.intentId,

      policy,

      signals: {
        machineReady: true,
        operatorCertified: true,
        safetyInspectionPassed: true,
        inventoryAvailable: true,
      },

      outcome: DecisionOutcome.APPROVED,

      reason:
        "Production policy v2.3.1 approved execution.",

      evaluatedAt: new Date(),
    },

    status: ExecutionStatus.COMPLETED,

    mode: ExecutionMode.SYNC,

    startedAt: new Date(),

    completedAt: new Date(),

    evidence: {
      productionLine: "LINE-3",
      batch: "BATCH-2026-001",
      productionStarted: true,
    },
  };

  const trustRecord: ExecutionTrustRecord = {
    trustRecordId: "trust-record-001",

    businessTransactionId:
      transaction.businessTransactionId,

    transaction,

    overrides: [],

    executions: [
      execution,
    ],

    verifications: [],

    receipts: [],

    trustRecordHash:
      "91c84e64b42b4fa89b2df6f7a37fd0d5",

    createdAt: new Date(),

    updatedAt: new Date(),
  };

  console.log();
  console.log("======================================");
  console.log(" Parmana TypeScript SDK");
  console.log(" Example 10 - Custom Policy");
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

  console.log("Explicit Policy");
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

  console.log("Decision");
  console.log("------------------------------");
  console.log(
    "Outcome      :",
    execution.decision.outcome,
  );
  console.log(
    "Reason       :",
    execution.decision.reason,
  );

  console.log();

  console.log("Runtime Signals");
  console.log("------------------------------");
  console.log(
    execution.decision.signals,
  );

  console.log();

  console.log("Execution");
  console.log("------------------------------");
  console.log(
    "Status       :",
    execution.status,
  );
  console.log(
    "Mode         :",
    execution.mode,
  );
  console.log(
    "Evidence     :",
    execution.evidence,
  );

  console.log();

  console.log("Execution Trust Record");
  console.log("------------------------------");
  console.log(
    "Trust Record :",
    trustRecord.trustRecordId,
  );
  console.log(
    "Hash         :",
    trustRecord.trustRecordHash,
  );

  console.log();

  console.log(
    "Submitting transaction to Parmana Runtime...",
  );

  try {
    const receipt = await client.execute(
      transaction,
    );

    console.log();

    console.log("Receipt");
    console.log("------------------------------");
    console.log(
      "Receipt ID   :",
      receipt.receiptId,
    );
    console.log(
      "Algorithm    :",
      receipt.algorithm,
    );
    console.log(
      "Issued At    :",
      receipt.issuedAt,
    );
  } catch (error) {
    console.log();
    console.log(
      "Runtime not available (expected during SDK development).",
    );

    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  console.log();

  console.log("Execution Trust Chain");
  console.log("------------------------------");
  console.log("✓ Authority");
  console.log("✓ Authorization");
  console.log("✓ Intent");
  console.log("✓ Explicit PolicyReference");
  console.log("✓ Policy Evaluation");
  console.log("✓ Decision");
  console.log("✓ Execution");
  console.log("✓ Execution Evidence");
  console.log("✓ Execution Trust Record");

  console.log();

  console.log("Architectural Principle");
  console.log("------------------------------");
  console.log(
    "BusinessTransaction specifies the PolicyReference.",
  );
  console.log(
    "The Runtime loads exactly one policy version.",
  );
  console.log(
    "The Runtime never discovers or selects policies.",
  );
  console.log(
    "Deterministic replay always evaluates",
  );
  console.log(
    "the same policy version.",
  );

  console.log();

  console.log("Example completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});