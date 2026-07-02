import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

import { createBusinessTransaction } from "./fixtures/business-transaction.js";

describe("Execution Trust Lifecycle", () => {
  it("should execute, verify, generate a receipt and replay a business transaction", async () => {
    //
    // Arrange
    //
    const transaction =
      createBusinessTransaction();

    //
    // Execute
    //
    const execute =
      await request(app)
        .post("/execute")
        .send(transaction);

    console.log("EXECUTE");
    console.dir(
      execute.body,
      { depth: null },
    );

    expect(execute.status).toBe(200);

    //
    // Verify
    //
    const verify =
      await request(app)
        .post("/verify")
        .send({
          businessTransactionId:
            transaction.businessTransactionId,
        });

    console.log("VERIFY");
    console.dir(
      verify.body,
      { depth: null },
    );

    expect(verify.status).toBe(200);

    //
    // Receipt
    //
    const receipt =
      await request(app)
        .post("/receipt")
        .send({
          businessTransactionId:
            transaction.businessTransactionId,
        });

    console.log("RECEIPT");
    console.dir(
      receipt.body,
      { depth: null },
    );

    expect(receipt.status).toBe(200);

    //
    // Replay
    //
    const replay =
      await request(app)
        .post("/replay")
        .send({
          businessTransactionId:
            transaction.businessTransactionId,
        });

    console.log("REPLAY");
    console.dir(
      replay.body,
      { depth: null },
    );

    expect(replay.status).toBe(200);
  });
});