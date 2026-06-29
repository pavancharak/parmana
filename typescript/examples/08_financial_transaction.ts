/**
 * Parmana TypeScript SDK
 *
 * Example 08
 *
 * Financial Transaction
 *
 * Demonstrates how Parmana governs an
 * AI-assisted financial transaction.
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
    authorityId: "bank-001",
    authorityName: "Acme National Bank",
    createdAt: new Date(),
  };

  const authorization: Authorization = {
    authorizationId: "authorization-001",
    authorityId: authority.authorityId,
    subject: "payment-engine",
    permissions: [
      "APPROVE_PAYMENT",
    ],
    issuedAt: new Date(),
    expiresAt: new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000,
    ),
  };

  const intent: Intent = {
    intentId: "intent-001",
    authorizationId: authorization.authorizationId,
    operation: "APPROVE_PAYMENT",
    target: "SUPPLIER-ACME",
    createdAt: new Date(),
  };

  const policy: PolicyReference = {
    policyName: "aml-fraud-policy",
    policyVersion: "1.0.0",
  };

  const transaction: BusinessTransaction = {
    businessTransactionId: "payment-001",
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
        amount: 25000,
        currency: "USD",
        kycVerified: true,
        amlPassed: true,
        sanctionsMatch: false,
        fraudScore: 0.08,
      },

      outcome: DecisionOutcome.APPROVED,

      reason:
        "Payment satisfies AML and fraud policies.",

      evaluatedAt: new Date(),
    },

    status: ExecutionStatus.COMPLETED,

    mode: ExecutionMode.SYNC,

    startedAt: new Date(),

    completedAt: new Date(),

    evidence: {
      paymentReference: "PAY-2026-0001",
      settlementStatus: "SETTLED",
      paymentNetwork: "SWIFT",
      settlementTime: new Date().toISOString(),
    },
  };

  const trustRecord: ExecutionTrustRecord = {
    trustRecordId: "trust-record-payment-001",

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
      "bafd1d0e9ab243f18e71b82b8b7cb90d",

    createdAt: new Date(),

    updatedAt: new Date(),
  };

  console.log();
  console.log("======================================");
  console.log(" Parmana TypeScript SDK");
  console.log(" Example 08 - Financial Transaction");
  console.log("======================================");
  console.log();

  console.log("Payment");
  console.log("------------------------------");
  console.log(
    "Bank         :",
    authority.authorityName,
  );
  console.log(
    "Transaction  :",
    transaction.businessTransactionId,
  );
  console.log(
    "Operation    :",
    intent.operation,
  );
  console.log(
    "Target       :",
    intent.target,
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

  console.log("Risk Signals");
  console.log("------------------------------");
  console.log(
    execution.decision.signals,
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
    "Submitting payment to Parmana Runtime...",
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
  console.log("✓ Payment Intent");
  console.log("✓ Policy Reference");
  console.log("✓ AML Signals");
  console.log("✓ Fraud Signals");
  console.log("✓ Policy Decision");
  console.log("✓ Payment Execution");
  console.log("✓ Execution Evidence");
  console.log("✓ Execution Trust Record");

  console.log();

  console.log(
    "Parmana does not process payments.",
  );
  console.log(
    "It governs how financial transactions",
  );
  console.log(
    "are authorized, evaluated, executed,",
  );
  console.log(
    "recorded, and independently verified.",
  );

  console.log();
  console.log("Example completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});