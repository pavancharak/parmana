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
      "custom-policy-demo",

    sourceSystem:
      "typescript-sdk-example",

    submittedBy:
      "custom-application",

    submittedAt:
      new Date(),
  },

  authority: {
    authorityId:
      "authority-custom-001",

    authorityType:
      AuthorityType.SERVICE,

    principalId:
      "custom-application",

    displayName:
      "Custom Business Application",

    issuedAt:
      new Date(),
  },

  authorization: {
    authorizationId:
      "authorization-custom-001",

    authorityId:
      "authority-custom-001",

    purpose:
      "Authorize custom business workflow",

    issuedAt:
      new Date(),
  },

  intent: {
    intentId:
      "intent-custom-001",

    authorizationId:
      "authorization-custom-001",

    action:
      "ExecuteCustomWorkflow",

    target:
      "workflow/CUSTOM-001",

    parameters: {
      workflowName:
        "Example Custom Workflow",

      initiatedBy:
        "developer",
    },

    createdAt:
      new Date(),
  },

  policy: {
    name:
      "custom-policy",

    version:
      "1.0.0",

    schemaVersion:
      "1.0.0",
  },

  signals: {
    customRulePassed: true,
    riskAccepted: true,
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