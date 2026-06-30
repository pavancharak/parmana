import {
  HttpTransport,
  ParmanaClient,
} from "@parmana/typescript-sdk";

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

const verification =
  await client.verify(
    "550e8400-e29b-41d4-a716-446655440000",
  );

console.log(
  verification,
);