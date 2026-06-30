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

const policy =
  {} as Policy;

const result =
  await client.validatePolicy(
    policy,
  );

console.log(
  result,
);
