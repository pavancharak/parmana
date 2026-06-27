import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

beforeAll(() => {
  process.env.PARMANA_STORAGE = "supabase";
});

import app from "../src/app.js";

describe("Replay Integration", () => {
  it("replays a previously executed Business Transaction", async () => {
    //
    // Execute
    //
    const execute = await request(app)
      .post("/execute")

      .send({
        businessTransactionId: crypto.randomUUID(),

        status: "AUTHORIZED",

        metadata: {},

        policy: {},

        signals: {},

        decision: {},
      });

    expect(execute.status).toBe(200);

    //
    // Verify
    //
    await request(app)
      .post("/verify")

      .send({
        businessTransactionId: execute.body.businessTransactionId,
      });

    //
    // Receipt
    //
    await request(app)
      .post("/receipt")

      .send({
        businessTransactionId: execute.body.businessTransactionId,
      });

    //
    // Replay
    //
    const replay = await request(app)
      .post("/replay")

      .send({
        businessTransactionId: execute.body.businessTransactionId,
      });

    expect(replay.status).toBe(200);

    //
    // Replay should produce the same
    // deterministic Trust Record hash.
    //
    expect(replay.body.businessTransactionId).toBe(
      execute.body.businessTransactionId,
    );

    expect(replay.body.trustRecordHash).toBe(execute.body.trustRecordHash);

    expect(replay.body.verified).toBe(true);
  });
});
