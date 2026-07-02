import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

import { createBusinessTransaction } from "./fixtures/business-transaction.js";

/**
 * This test is intentionally skipped.
 *
 * The current RuntimeFactory always creates a
 * DefaultExecutionSystem internally, making it
 * impossible to inject a failing implementation.
 *
 * This test should be enabled after RuntimeFactory
 * supports dependency injection for ExecutionSystem.
 */
describe.skip("Execution Failure", () => {
  it(
    "should mark execution as FAILED when the execution system throws",
    async () => {
      //
      // Arrange
      //
      const transaction =
        createBusinessTransaction();

      //
      // Execute
      //
      const response =
        await request(app)
          .post("/execute")
          .send(transaction);

      //
      // Expected future behavior
      //
      expect(response.status).toBe(500);

      expect(
        response.body.execution.status,
      ).toBe("FAILED");

      expect(
        response.body.error,
      ).toContain(
        "Execution System",
      );
    },
  );
});