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
      "medical-ai-demo",

    sourceSystem:
      "typescript-sdk-example",

    submittedBy:
      "clinical-decision-system",

    submittedAt:
      new Date(),
  },

  authority: {
    authorityId:
      "authority-med-001",

    authorityType:
      AuthorityType.SERVICE,

    principalId:
      "clinical-decision-system",

    displayName:
      "Clinical Decision System",

    issuedAt:
      new Date(),
  },

  authorization: {
    authorizationId:
      "authorization-med-001",

    authorityId:
      "authority-med-001",

    purpose:
      "Authorize AI treatment recommendation",

    issuedAt:
      new Date(),
  },

  intent: {
    intentId:
      "intent-med-001",

    authorizationId:
      "authorization-med-001",

    action:
      "RecommendTreatment",

    target:
      "patient/P-1001",

    parameters: {
      diagnosis:
        "Hypertension",

      medication:
        "Medication-A",
    },

    createdAt:
      new Date(),
  },

  policy: {
    name:
      "medical-treatment",

    version:
      "1.0.0",

    schemaVersion:
      "1.0.0",
  },

  signals: {
  physicianApproved: true,
  allergiesChecked: true,
  dosageWithinLimit: true,
  patientStable: true,
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