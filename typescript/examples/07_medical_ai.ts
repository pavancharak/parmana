/**
 * Parmana TypeScript SDK
 *
 * Example 07
 *
 * Medical AI
 *
 * Demonstrates how Parmana governs AI-assisted
 * clinical decision execution while preserving
 * an immutable execution trust chain.
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
    authorityId: "hospital-001",
    authorityName: "City General Hospital",
    createdAt: new Date(),
  };

  const authorization: Authorization = {
    authorizationId: "authorization-001",
    authorityId: authority.authorityId,
    subject: "clinical-ai-assistant",
    permissions: [
      "CLINICAL_DECISION_SUPPORT",
    ],
    issuedAt: new Date(),
    expiresAt: new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000,
    ),
  };

  const intent: Intent = {
    intentId: "intent-001",
    authorizationId: authorization.authorizationId,
    operation: "ASSESS_PATIENT",
    target: "patient-100234",
    createdAt: new Date(),
  };

  const policy: PolicyReference = {
    policyName: "clinical-decision-policy",
    policyVersion: "1.0.0",
  };

  const transaction: BusinessTransaction = {
    businessTransactionId: "medical-txn-001",
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
        patientAge: 64,
        bloodPressure: "145/90",
        heartRate: 96,
        oxygenSaturation: 98,
        allergyCheck: "CLEAR",
        physicianAvailable: true,
      },

      outcome: DecisionOutcome.APPROVED,

      reason:
        "Clinical policy satisfied. AI recommendation may be presented to physician.",

      evaluatedAt: new Date(),
    },

    status: ExecutionStatus.COMPLETED,

    mode: ExecutionMode.SYNC,

    startedAt: new Date(),

    completedAt: new Date(),

    evidence: {
      diagnosisSuggestion:
        "Community Acquired Pneumonia",

      confidence: 0.94,

      physicianReviewRequired: true,

      physicianApproved: true,
    },
  };

  const trustRecord: ExecutionTrustRecord = {
    trustRecordId: "trust-record-medical-001",

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
      "d71f2dcb4d3044bb94752c13abfe8129",

    createdAt: new Date(),

    updatedAt: new Date(),
  };

  console.log();
  console.log("======================================");
  console.log(" Parmana TypeScript SDK");
  console.log(" Example 07 - Medical AI");
  console.log("======================================");
  console.log();

  console.log("Clinical Case");
  console.log("------------------------------");
  console.log(
    "Hospital     :",
    authority.authorityName,
  );
  console.log(
    "Patient      :",
    intent.target,
  );
  console.log(
    "Operation    :",
    intent.operation,
  );

  console.log();

  console.log("Policy");
  console.log("------------------------------");
  console.log(
    "Policy       :",
    policy.policyName,
  );
  console.log(
    "Version      :",
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

  console.log("Clinical Signals");
  console.log("------------------------------");
  console.log(
    execution.decision.signals,
  );

  console.log();

  console.log("Execution Evidence");
  console.log("------------------------------");
  console.log(
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
  console.log("✓ Hospital Authority");
  console.log("✓ Clinical Authorization");
  console.log("✓ Medical Intent");
  console.log("✓ Policy Reference");
  console.log("✓ Clinical Signals");
  console.log("✓ Policy Decision");
  console.log("✓ AI Recommendation");
  console.log("✓ Execution Evidence");
  console.log("✓ Execution Trust Record");

  console.log();

  console.log(
    "Parmana does not diagnose patients.",
  );
  console.log(
    "It governs the execution of AI-assisted",
  );
  console.log(
    "clinical workflows so every authorization,",
  );
  console.log(
    "policy evaluation, execution, and outcome",
  );
  console.log(
    "remain independently verifiable.",
  );

  console.log();
  console.log("Example completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});