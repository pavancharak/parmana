import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("POST /verify", () => {

  it(
    "returns an application error when the Execution Trust Record does not exist",
    async () => {

      const response =
        await request(app)
          .post("/verify")
          .send({

            businessTransactionId:
              "txn-001",

          });

      expect(response.status)
        .toBe(500);

      expect(response.body.error)
        .toBe(
          "Execution Trust Record not found."
        );

    }
  );

});