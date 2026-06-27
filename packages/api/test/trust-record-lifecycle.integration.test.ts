import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

beforeAll(() => {
  process.env.PARMANA_STORAGE = "supabase";
});

import app from "../src/app.js";

describe("Execution Trust Record Lifecycle", () => {
  it("maintains the complete trust lifecycle", async () => {
    //
    // Execute
    //
    const executeResponse = await request(app)
      .post("/execute")

      .send({
        businessTransactionId: crypto.randomUUID(),

        status: "AUTHORIZED",

        metadata: {},

        policy: {},

        signals: {},

        decision: {},
      });

    expect(executeResponse.status).toBe(200);

    const trustRecord = executeResponse.body;

    //
    // Trust Record after Execute
    //
    const trustRecordAfterExecute = await request(app).get(
      `/trust-records/${trustRecord.businessTransactionId}`,
    );

    expect(trustRecordAfterExecute.status).toBe(200);

    expect(trustRecordAfterExecute.body.executions.length).toBe(1);

    expect(trustRecordAfterExecute.body.verifications.length).toBe(0);

    expect(trustRecordAfterExecute.body.receipts.length).toBe(0);

    //
    // Verify
    //
    const verifyResponse = await request(app)
      .post("/verify")

      .send({
        businessTransactionId: trustRecord.businessTransactionId,
      });

    expect(verifyResponse.status).toBe(200);

    //
    // Trust Record after Verify
    //
    const trustRecordAfterVerify = await request(app).get(
      `/trust-records/${trustRecord.businessTransactionId}`,
    );

    expect(trustRecordAfterVerify.status).toBe(200);

    expect(trustRecordAfterVerify.body.executions.length).toBe(1);

    expect(trustRecordAfterVerify.body.verifications.length).toBe(1);

    expect(trustRecordAfterVerify.body.receipts.length).toBe(0);

    //
    // Receipt
    //
    const receiptResponse = await request(app)
      .post("/receipt")

      .send({
        businessTransactionId: trustRecord.businessTransactionId,
      });

    expect(receiptResponse.status).toBe(200);

    //
    // Trust Record after Receipt
    //
    const trustRecordAfterReceipt = await request(app).get(
      `/trust-records/${trustRecord.businessTransactionId}`,
    );

    expect(trustRecordAfterReceipt.status).toBe(200);

    expect(trustRecordAfterReceipt.body.executions.length).toBe(1);

    expect(trustRecordAfterReceipt.body.verifications.length).toBe(1);

    expect(trustRecordAfterReceipt.body.receipts.length).toBe(1);

    //
    // Invariants
    //
    expect(trustRecordAfterReceipt.body.businessTransactionId).toBe(
      trustRecord.businessTransactionId,
    );

    expect(trustRecordAfterReceipt.body.trustRecordHash).toBe(
      trustRecord.trustRecordHash,
    );
  });
});
