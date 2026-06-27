import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("GET /verification/:id", () => {

  it(
    "returns 404 when the Execution Trust Record does not exist",
    async () => {

      const response =
        await request(app)
          .get("/verification/txn-001");

      expect(response.status)
        .toBe(404);

      expect(response.body.error)
        .toBe(
          "Execution Trust Record not found."
        );

    }
  );

  it(
    "returns 404 when no Verification exists",
    async () => {

      // This test becomes meaningful once an
      // Execution Trust Record can exist without
      // any Verification artifacts.
      //
      // For now, the repository returns the same
      // "Execution Trust Record not found." error.

      const response =
        await request(app)
          .get("/verification/txn-001");

      expect(response.status)
        .toBe(404);

    }
  );

});
