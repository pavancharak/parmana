import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("POST /execute", () => {

  it(
    "returns a validation error for an invalid Business Transaction ID",
    async () => {

      const response =
        await request(app)

          .post("/execute")

          .send({

            businessTransactionId:
              "txn-001",

            status: "AUTHORIZED",

            metadata: {},

            policy: {},

            signals: {},

            decision: {},

          });

      expect(
        response.status
      ).toBe(400);

      expect(
        response.body.error
      ).toBe(
        "businessTransactionId must be a valid UUID."
      );

    }

  );

});
