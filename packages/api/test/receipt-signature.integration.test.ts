import { createBusinessTransaction } from "./fixtures/business-transaction.js";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import { CryptoBootstrap, SignatureVerifier } from "@parmana/crypto";

import app from "../src/app.js";

interface ReceiptResponse {
  receiptId: string;
  businessTransactionId: string;
  trustRecordHash: string;
  receiptHash: string;
  issuedAt: string;
  algorithm: string;
  signature: string;
}

beforeAll(() => {
  process.env.PARMANA_STORAGE = "supabase";
});

describe("Receipt Signature", () => {
  it("generates a verifiable receipt signature", async () => {
    const businessTransactionId = crypto.randomUUID();

    const authorityId = crypto.randomUUID();
    const authorizationId = crypto.randomUUID();
    const intentId = crypto.randomUUID();

    //
    const transaction = createBusinessTransaction();

    // Execute
    //
    const execute = await request(app).post("/execute").send(transaction);

    expect(execute.status).toBe(200);

    const trustRecord = execute.body;

    //
    // Verify
    //
    const verify = await request(app).post("/verify").send({
      businessTransactionId: trustRecord.businessTransactionId,
    });

    expect(verify.status).toBe(200);

    //
    // Receipt
    //
    const receipt = await request(app).post("/receipt").send({
      businessTransactionId: trustRecord.businessTransactionId,
    });

    expect(receipt.status).toBe(200);

    //
    // Verify signature
    //
    const cryptoProvider = CryptoBootstrap.create();

    const verifier = new SignatureVerifier(cryptoProvider);

    const receiptBody = receipt.body as ReceiptResponse;

    const { signature, ...unsignedReceipt } = receiptBody;

    const verified = await verifier.verify(unsignedReceipt, signature);

    expect(verified).toBe(true);
  });
});



