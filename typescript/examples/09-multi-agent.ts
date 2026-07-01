import {
  AuthorityType,
  BusinessTransaction,
  BusinessTransactionStatus,
  HttpTransport,
  ParmanaClient,
} from "@parmana/typescript-sdk";

import { randomUUID } from "node:crypto";

const client =
  new ParmanaClient({
    endpoint:
      "http://localhost:3000",

    transport:
      new HttpTransport({
        endpoint:
          "http://localhost:3000",
      }),
  });

const businessTransactionId =
  randomUUID();

const transaction: BusinessTransaction = {
  businessTransactionId,

  metadata: {
    businessTransactionId,

    correlationId:
      "multi-agent-demo",

    sourceSystem:
      "typescript-sdk-example",

    submittedBy:
      "agent-orchestrator",

    submittedAt:
      new Date(),
  },

  authority: {
    authorityId:
      "authority-agent-001",

    authorityType:
      AuthorityType.SERVICE,

    principalId:
      "agent-orchestrator",

    displayName:
      "Multi-Agent Orchestrator",

    issuedAt:
      new Date(),
  },

  authorization: {
    authorizationId:
      "authorization-agent-001",

    authorityId:
      "authority-agent-001",

    purpose:
      "Authorize coordinated multi-agent execution",

    issuedAt:
      new Date(),
  },

  intent: {
    intentId:
      "intent-agent-001",

    authorizationId:
      "authorization-agent-001",

    action:
      "ExecuteWorkflow",

    target:
      "workflow/WF-001",

    parameters: {
      workflow:
        "CustomerOnboarding",

      participatingAgents: [
        "Planner",
        "Researcher",
        "Executor",
      ],
    },

    createdAt:
      new Date(),
  },

  policy: {
    name:
      "multi-agent",

    version:
      "1.0.0",

    schemaVersion:
      "1.0.0",
  },

  signals: {
    plannerApproved: true,
    consensusReached: true,
    executionReady: true,
  },

  status:
    BusinessTransactionStatus.RECEIVED,

  createdAt:
    new Date(),
};

const trustRecord =
  await client.execute(
    transaction,
  );

console.log(
  JSON.stringify(
    trustRecord,
    null,
    2,
  ),
);