
/**
 * Parmana TypeScript SDK
 *
 * Example 06
 *
 * Autonomous Vehicle
 *
 * Demonstrates how Parmana governs the execution
 * of an autonomous vehicle using a deterministic
 * execution trust chain.
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
    authorityName: "Autonomous Fleet Authority",
    createdAt: new Date(),
  };

  const authorization: Authorization = {
    authorizationId: "authorization-001",
    authorityId: authority.authorityId,
    subject: "vehicle-av-007",
    permissions: [
      "AUTONOMOUS_DRIVE",
    ],
    issuedAt: new Date(),
    expiresAt: new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ),
  };

  const intent: Intent = {
    intentId: "intent-001",
    authorizationId: authorization.authorizationId,
    operation: "AUTONOMOUS_DRIVE",
    target: "Destination Alpha",
    createdAt: new Date(),
  };

  const policy: PolicyReference = {
    policyName: "autonomous-driving-policy",
    policyVersion: "1.0.0",
  };

  const transaction: BusinessTransaction = {
    businessTransactionId: "txn-av-001",
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
        gpsLock: true,
        obstacleDetected: false,
        batteryLevel: 92,
        weather: "CLEAR",
      },
      outcome: DecisionOutcome.APPROVED,
      reason:
        "All driving policy conditions satisfied.",
      evaluatedAt: new Date(),
    },

    status: ExecutionStatus.COMPLETED,

    mode: ExecutionMode.SYNC,

    startedAt: new Date(),

    completedAt: new Date(),

    evidence: {
      distanceKm: 18.4,
      averageSpeed: 42,
      destinationReached: true,
    },
  };

  const trustRecord: ExecutionTrustRecord = {
    trustRecordId: "trust-record-av-001",

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
      "a1f94b0c6d5a4d7280bb59b7d41d9012",

    createdAt: new Date(),

    updatedAt: new Date(),
  };

  console.log();
  console.log("======================================");
  console.log(" Parmana TypeScript SDK");
  console.log(" Example 06 - Autonomous Vehicle");
  console.log("======================================");
  console.log();

  console.log("Vehicle");
  console.log("------------------------------");
  console.log(
    "Vehicle       :",
    authorization.subject,
  );
  console.log(
    "Destination   :",
    intent.target,
  );

  console.log();

  console.log("Policy");
  console.log("------------------------------");
  console.log(
    "Policy        :",
    policy.policyName,
  );
  console.log(
    "Version       :",
    policy.policyVersion,
  );

  console.log();

  console.log("Decision");
  console.log("------------------------------");
  console.log(
    "Outcome       :",
    execution.decision.outcome,
  );
  console.log(
    "Reason        :",
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
    "Status        :",
    execution.status,
  );
  console.log(
    "Mode          :",
    execution.mode,
  );
  console.log(
    "Evidence      :",
    execution.evidence,
  );

  console.log();

  console.log("Execution Trust Record");
  console.log("------------------------------");
  console.log(
    "Trust Record  :",
    trustRecord.trustRecordId,
  );
  console.log(
    "Hash          :",
    trustRecord.trustRecordHash,
  );

  console.log();

  console.log(
    "Submitting execution to Parmana Runtime...",
  );

  try {
    const receipt = await client.execute(
      transaction,
    );

    console.log();
    console.log("Receipt");
    console.log("------------------------------");
    console.log(
      "Receipt ID    :",
      receipt.receiptId,
    );
    console.log(
      "Algorithm     :",
      receipt.algorithm,
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

  console.log("Trust Chain");
  console.log("------------------------------");
  console.log("✓ Authority");
  console.log("✓ Authorization");
  console.log("✓ Intent");
  console.log("✓ Policy Reference");
  console.log("✓ Runtime Signals");
  console.log("✓ Decision");
  console.log("✓ Execution");
  console.log("✓ Execution Evidence");
  console.log("✓ Execution Trust Record");

  console.log();

  console.log(
    "The autonomous vehicle remains independently",
  );
  console.log(
    "verifiable because every execution artifact",
  );
  console.log(
    "is recorded as part of the immutable",
  );
  console.log(
    "Execution Trust Record.",
  );

  console.log();
  console.log("Example completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});