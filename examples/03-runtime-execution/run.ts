import { RuntimeEngine } from "@parmana/runtime";
import { RuntimePipeline } from "@parmana/runtime";
import { BusinessTransactionStatus } from "@parmana/shared";

const pipeline = new RuntimePipeline([]);

const runtime = new RuntimeEngine(pipeline);

const transaction = {
  businessTransactionId: "txn-003",

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

const result = await runtime.execute(transaction as any);

console.log("==================================");
console.log("Parmana Example 03 - Runtime Execution");
console.log("==================================");

console.log(JSON.stringify(result, null, 2));