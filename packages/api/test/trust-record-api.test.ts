import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("GET /trust-records/:id", () => {

  it(
    "returns 404 when the Execution Trust Record does not exist",
    async () => {

      const response =
        await request(app)
          .get("/trust-records/txn-001");

      expect(response.status)
        .toBe(404);

      expect(response.body.error)
        .toBe(
          "Execution Trust Record not found."
        );

    }
  );

});
