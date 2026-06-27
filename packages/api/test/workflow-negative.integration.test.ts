import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

beforeAll(() => {
  process.env.PARMANA_STORAGE = "supabase";
});

import app from "../src/app.js";

describe("Negative Workflow Integration", () => {

  it("fails verification for an unknown Business Transaction", async () => {

    const response =
      await request(app)

        .post("/verify")

        .send({

          businessTransactionId:
            crypto.randomUUID(),

        });

    expect(
      response.status
    ).toBe(500);

    expect(
      response.body.error
    ).toContain(
      "Execution Trust Record not found."
    );

  });

  it("fails receipt generation before verification", async () => {

    //
    // Execute only
    //
    const execute =
      await request(app)

        .post("/execute")

        .send({

          businessTransactionId:
            crypto.randomUUID(),

          status: "AUTHORIZED",

          metadata: {},

          policy: {},

          signals: {},

          decision: {},

        });

    expect(
      execute.status
    ).toBe(200);

    //
    // Try generating a receipt without verification.
    //
    const receipt =
      await request(app)

        .post("/receipt")

        .send({

          businessTransactionId:
            execute.body.businessTransactionId,

        });

    expect(
      receipt.status
    ).toBe(500);

    expect(
      receipt.body.error
    ).toContain(
      "Execution Trust Record must be successfully verified"
    );

  });

  it("fails for an unknown Trust Record", async () => {

    const response =
      await request(app)

        .get(
          `/trust-records/${crypto.randomUUID()}`
        );

    expect(
      response.status
    ).toBe(404);

  });

  it("fails verification when Business Transaction ID is missing", async () => {

    const response =
      await request(app)

        .post("/verify")

        .send({});

    expect(
      response.status
    ).toBe(400);

  });

  it("fails verification for an invalid Business Transaction ID", async () => {

    const response =
      await request(app)

        .post("/verify")

        .send({

          businessTransactionId:
            "not-a-uuid",

        });

    expect(
      response.status
    ).toBe(400);

  });

});
