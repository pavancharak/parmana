import {
  AuthorityType,
  BusinessTransaction,
  BusinessTransactionStatus,
  HttpTransport,
  ParmanaClient,
} from "@parmana/typescript-sdk";

const businessTransactionId =
  "550e8400-e29b-41d4-a716-446655440000";

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

const transaction: BusinessTransaction = {
  businessTransactionId,

  metadata: {
    businessTransactionId,

    correlationId:
      "corr-001",

    tenantId:
      "tenant-001",

    sourceSystem:
      "typescript-sdk-example",

    submittedBy:
      "demo-user",

    submittedAt:
      new Date(),
  },

  authority: {
    authorityId:
      "authority-001",

    authorityType:
      AuthorityType.USER,

    principalId:
      "alice@example.com",

    displayName:
      "Alice",

    issuedAt:
      new Date(),
  },

  authorization: {
    authorizationId:
      "authorization-001",

    authorityId:
      "authority-001",

    purpose:
      "Vendor payment approval",

    issuedAt:
      new Date(),
  },

  intent: {
    intentId:
      "intent-001",

    authorizationId:
      "authorization-001",

    action:
      "TransferFunds",

    target:
      "vendor/vendor-123",

    parameters: {
      amount: 100,
      currency: "USD",
    },

    createdAt:
      new Date(),
  },

  policy: {
    name:
      "vendor-payment",

    version:
      "1.0.0",

    schemaVersion:
      "1.0.0",
  },

  signals: {
    amount: 100,
    vendorVerified: true,
    paymentApproved: true,
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