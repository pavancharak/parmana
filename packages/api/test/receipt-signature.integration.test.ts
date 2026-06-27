import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import {
  CryptoBootstrap,
  SignatureVerifier,
} from "@parmana/crypto";

beforeAll(() => {
  process.env.PARMANA_STORAGE = "supabase";
});

import app from "../src/app.js";

describe("Receipt Signature", () => {

  it("generates a verifiable receipt signature", async () => {

    //
    // Execute
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

    expect(execute.status).toBe(200);

    const trustRecord =
      execute.body;

    //
    // Verify
    //
    const verify =
      await request(app)

        .post("/verify")

        .send({

          businessTransactionId:
            trustRecord.businessTransactionId,

        });

    expect(verify.status).toBe(200);

    //
    // Receipt
    //
    const receipt =
      await request(app)

        .post("/receipt")

        .send({

          businessTransactionId:
            trustRecord.businessTransactionId,

        });

    expect(receipt.status).toBe(200);

    //
    // Verify signature
    //
    const cryptoProvider =
      CryptoBootstrap.create();

    const verifier =
      new SignatureVerifier(
        cryptoProvider
      );

    const unsignedReceipt = {

      ...receipt.body,

    };

    delete (unsignedReceipt as any).signature;

    const verified =
      await verifier.verify(

        unsignedReceipt,

        receipt.body.signature

      );

    expect(
      verified
    ).toBe(true);

  });

});