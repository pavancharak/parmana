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
      "wire-transfer-demo",

    sourceSystem:
      "typescript-sdk-example",

    submittedBy:
      "banking-platform",

    submittedAt:
      new Date(),
  },

  authority: {
    authorityId:
      "authority-bank-001",

    authorityType:
      AuthorityType.SERVICE,

    principalId:
      "banking-platform",

    displayName:
      "Core Banking Platform",

    issuedAt:
      new Date(),
  },

  authorization: {
    authorizationId:
      "authorization-bank-001",

    authorityId:
      "authority-bank-001",

    purpose:
      "Authorize wire transfer",

    issuedAt:
      new Date(),
  },

  intent: {
    intentId:
      "intent-bank-001",

    authorizationId:
      "authorization-bank-001",

    action:
      "WireTransfer",

    target:
      "account/ACC-2001",

    parameters: {
      beneficiary:
        "John Doe",

      currency:
        "USD",
    },

    createdAt:
      new Date(),
  },

  policy: {
    name:
      "wire-transfer",

    version:
      "1.0.0",

    schemaVersion:
      "1.0.0",
  },

  signals: {
    amount: 5000,
    amlPassed: true,
    sanctionsPassed: true,
    accountVerified: true,
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