import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

beforeAll(() => {
  process.env.PARMANA_STORAGE = "supabase";
});

import app from "../src/app.js";

describe("Receipt Negative Integration", () => {
  it("fails for an unknown Business Transaction", async () => {
    const response = await request(app).post("/receipt").send({
      businessTransactionId: crypto.randomUUID(),
    });

    expect(response.status).toBe(500);

    expect(response.body.error).toContain("Execution Trust Record");
  });

  it("fails when Business Transaction ID is missing", async () => {
    const response = await request(app).post("/receipt").send({});

    expect(response.status).toBe(400);
  });

  it("fails for an invalid Business Transaction ID", async () => {
    const response = await request(app).post("/receipt").send({
      businessTransactionId: "abc",
    });

    expect(response.status).toBe(400);
  });
});
