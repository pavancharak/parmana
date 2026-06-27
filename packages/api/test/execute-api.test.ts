import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("POST /execute", () => {
  it("returns an application error when the transaction has not been persisted", async () => {

    const transaction = {
      businessTransactionId: "txn-001",

      metadata: {
        businessTransactionId: "txn-001",
      },

      policy: {
        name: "payment-approval",
        version: "1.0.0",
        schemaVersion: "1.0",
      },

      signals: {},

      decision: {
        decisionId: "dec-001",
        outcome: "APPROVED",
        evaluatedAt: new Date(),
        policy: {
          name: "payment-approval",
          version: "1.0.0",
          schemaVersion: "1.0",
        },
      },

      status: "APPROVED",

      createdAt: new Date(),
    };

    const response = await request(app)
      .post("/execute")
      .send(transaction);

    expect(response.status).toBe(500);

    expect(response.body.error).toBe(
      "Execution Trust Record not found."
    );
  });
});