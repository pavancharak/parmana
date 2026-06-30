import {
  HttpTransport,
  ParmanaClient,
} from "@parmana/typescript-sdk";

import type {
  Policy,
} from "@parmana/policy";

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

const policy: Policy = {
  policyId:
    "vendor-payment",

  policyVersion:
    "1.0.0",

  schemaVersion:
    "1.0.0",

  signalsSchema: {
    amount: "number",
    vendorVerified: "boolean",
    paymentApproved: "boolean",
  },

  rules: [],
};

const result =
  await client.validatePolicy(
    policy,
  );

console.log(
  JSON.stringify(
    result,
    null,
    2,
  ),
);