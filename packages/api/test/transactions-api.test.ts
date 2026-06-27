import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("GET /transactions", () => {
  it("returns the list of Business Transactions", async () => {
    const response = await request(app).get("/transactions");

    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("GET /transactions/:id", () => {
  it("returns 404 when the Business Transaction does not exist", async () => {
    const response = await request(app).get("/transactions/txn-001");

    expect(response.status).toBe(404);

    expect(response.body.error).toBe("Business Transaction not found.");
  });
});
