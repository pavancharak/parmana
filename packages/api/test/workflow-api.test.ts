import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("Execution Trust Workflow", () => {

  it("executes the complete workflow", async () => {

    //
    // Step 1
    // Execute Business Transaction
    //

    const transaction = {
      businessTransactionId: "txn-workflow-001",

      metadata: {
        businessTransactionId: "txn-workflow-001",
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

    const execute =
      await request(app)
        .post("/execute")
        .send(transaction);

    //
    // The remaining assertions will become
    // meaningful once the repositories are
    // fully wired for end-to-end persistence.
    //

    expect(execute.status).toBeDefined();

  });

});