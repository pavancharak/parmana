/**
 * Parmana TypeScript SDK
 *
 * Example 09
 *
 * Multi-Agent
 *
 * Demonstrates how multiple AI agents execute a
 * shared Business Transaction under a single
 * Execution Trust Record.
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
    authorityName: "Acme AI Operations",
    createdAt: new Date(),
  };

  const authorization: Authorization = {
    authorizationId: "authorization-001",
    authorityId: authority.authorityId,
    subject: "multi-agent-platform",
    permissions: [
      "EXECUTE_MULTI_AGENT_WORKFLOW",
    ],
    issuedAt: new Date(),
    expiresAt: new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000,
    ),
  };

  const intent: Intent = {
    intentId: "intent-001",
    authorizationId: authorization.authorizationId,
    operation: "HANDLE_CUSTOMER_REQUEST",
    target: "customer-1001",
    createdAt: new Date(),
  };

  const policy: PolicyReference = {
    policyName: "multi-agent-governance-policy",
    policyVersion: "1.0.0",
  };

  const transaction: BusinessTransaction = {
    businessTransactionId: "multi-agent-001",
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
        plannerCompleted: true,
        researchCompleted: true,
        executionCompleted: true,
        safetyChecksPassed: true,
        confidence: 0.97,
      },

      outcome: DecisionOutcome.APPROVED,

      reason:
        "All required agents completed successfully.",

      evaluatedAt: new Date(),
    },

    status: ExecutionStatus.COMPLETED,

    mode: ExecutionMode.SYNC,

    startedAt: new Date(),

    completedAt: new Date(),

    evidence: {
      planner: {
        agent: "PlannerAgent",
        result: "Workflow generated",
      },

      research: {
        agent: "ResearchAgent",
        result: "Customer history retrieved",
      },

      execution: {
        agent: "ExecutionAgent",
        result: "Support response prepared",
      },
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
      "9ef40fbc06e94c56a5bc11d2d0d89ef1",

    createdAt: new Date(),

    updatedAt: new Date(),
  };

  console.log();
  console.log("======================================");
  console.log(" Parmana TypeScript SDK");
  console.log(" Example 09 - Multi-Agent");
  console.log("======================================");
  console.log();

  console.log("Workflow");
  console.log("------------------------------");
  console.log(
    "Organization :",
    authority.authorityName,
  );
  console.log(
    "Workflow     :",
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

  console.log("Participating Agents");
  console.log("------------------------------");

  const evidence = execution.evidence as Record<
    string,
    {
      agent: string;
      result: string;
    }
  >;

  for (const [name, value] of Object.entries(
    evidence,
  )) {
    console.log(
      `${name.padEnd(12)} : ${value.agent}`,
    );
    console.log(
      `Result        : ${value.result}`,
    );
    console.log();
  }

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
    "Submitting workflow to Parmana Runtime...",
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
  console.log("✓ Shared Business Transaction");
  console.log("✓ Planner Agent");
  console.log("✓ Research Agent");
  console.log("✓ Execution Agent");
  console.log("✓ Policy Evaluation");
  console.log("✓ Decision");
  console.log("✓ Execution Evidence");
  console.log("✓ Execution Trust Record");

  console.log();

  console.log(
    "Parmana does not orchestrate AI agents.",
  );
  console.log(
    "It governs the execution of the shared",
  );
  console.log(
    "workflow by recording a single immutable",
  );
  console.log(
    "Execution Trust Record that spans every",
  );
  console.log(
    "participating agent.",
  );

  console.log();
  console.log("Example completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});