import type { BusinessTransaction } from "@parmana/shared";
import { TEST_POLICY } from "./policies.js";
export function createBusinessTransaction(): BusinessTransaction {
  const businessTransactionId = crypto.randomUUID();

  const authorityId = crypto.randomUUID();
  const authorizationId = crypto.randomUUID();
  const intentId = crypto.randomUUID();

  return {
    businessTransactionId,

    metadata: {
      businessTransactionId,
      correlationId: crypto.randomUUID(),
      createdBy: "integration-test",
      createdAt: new Date(),
    },

    authority: {
      authorityId,
      authorityType: "USER",
      principalId: "integration-test",
      displayName: "Integration Test",
      issuedAt: new Date(),
    },

    authorization: {
      authorizationId,
      authorityId,
      purpose: "Integration Test",
      authorizedAt: new Date(),
    },

    intent: {
      intentId,
      authorizationId,
      action: "TEST",
      resource: "BusinessTransaction",
      issuedAt: new Date(),
    },

policy: TEST_POLICY,
   signals: {
  amount: 1000,
  vendorVerified: true,
  paymentApproved: true,
},

    decision: {
      outcome: "APPROVED",
    },

    status: "APPROVED",

    createdAt: new Date(),
  };
}
