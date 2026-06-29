import { BusinessTransactionStatus } from "@parmana/shared";

const transaction = {
  businessTransactionId: "txn-001",

  metadata: {
    executionMode: "SYNC",
  },

  authority: {
    authorityId: "authority-1",
  },

  authorization: {
    authorizationId: "authz-1",
  },

  intent: {
    intentId: "intent-1",
    action: "vendor-payment",
  },

  policy: {
    name: "vendor-payment",
    version: "1.0.0",
  },

  signals: {
    amount: 2500,
    riskScore: 15,
  },

  status: BusinessTransactionStatus.RECEIVED,

  createdAt: new Date(),
};

console.log("==================================");
console.log("Parmana Example 01 - Hello World");
console.log("==================================");
console.log(JSON.stringify(transaction, null, 2));
