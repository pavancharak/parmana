import { createBusinessTransaction } from "./fixtures/business-transaction.js";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

beforeAll(() => {
  process.env.PARMANA_STORAGE = "supabase";
});

import app from "../src/app.js";

describe("Supabase Workflow Integration", () => {
  it("executes a Business Transaction", async () => {
    //
   const transaction = createBusinessTransaction();

    // Execute
    //
    const response = await request(app)
      .post("/execute").send(transaction);

    console.log("EXECUTE:", response.status);

    console.log(response.body);

    expect(response.status).toBe(200);

    const trustRecord = response.body;

    //
    // Verify
    //
    const verifyResponse = await request(app)
      .post("/verify")

      .send({
        businessTransactionId: trustRecord.businessTransactionId,
      });

    console.log("VERIFY:", verifyResponse.status);

    console.log(verifyResponse.body);

    expect(verifyResponse.status).toBe(200);

    //
    // Receipt
    //
    const receiptResponse = await request(app)
      .post("/receipt")

      .send({
        businessTransactionId: trustRecord.businessTransactionId,
      });

    console.log("RECEIPT:", receiptResponse.status);

    console.log(receiptResponse.body);

    expect(receiptResponse.status).toBe(200);
  });
});





