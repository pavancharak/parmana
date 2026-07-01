import {
  HttpTransport,
  ParmanaClient,
} from "@parmana/typescript-sdk";

export function createClient() {
  return new ParmanaClient({
    endpoint:
      "http://localhost:3000",

    transport:
      new HttpTransport({
        endpoint:
          "http://localhost:3000",
      }),
  });
}