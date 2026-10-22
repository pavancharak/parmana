import { generateKeyPairSync } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CryptoBootstrap, LocalFileSigner } from "@parmana/crypto";
import {
  GatewayExternalAdapter,
  type ReleaseTransport,
} from "@parmana/execution-gateway";
import { PolicyValidator, type Policy } from "@parmana/policy";

import { createWalmartOrderEndpoint } from "../endpoint.js";
import { MockAgentGateway } from "../gateway.js";

/**
 * examples/walmart-agent-gateway against releases signed by the real
 * server code (GatewayExternalAdapter, as
 * scripts/generate-external-release-fixture.ts does) and a mock of the
 * vendor's gateway. Walmart's real gateway is not called.
 */

const AUDIENCE = "https://orders.example.com/parmana/walmart";
const KEY_ID = "walmart-example-release";
const ISSUED_AT = new Date("2026-10-22T10:00:00.000Z");
const NOW = new Date(ISSUED_AT.getTime() + 10_000);

let dir: string;
let publicKeyPem: string;
let signer: LocalFileSigner;
const savedEnv = {
  keyDir: process.env.PARMANA_KEY_DIR,
  keyId: process.env.PARMANA_VERIFICATION_KEY_ID,
};

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), "parmana-walmart-"));
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  writeFileSync(
    join(dir, `${KEY_ID}.private.pem`),
    privateKey.export({ format: "pem", type: "pkcs8" }),
  );
  publicKeyPem = publicKey.export({ format: "pem", type: "spki" }).toString();
  writeFileSync(join(dir, `${KEY_ID}.public.pem`), publicKeyPem);
  process.env.PARMANA_KEY_DIR = dir;
  process.env.PARMANA_VERIFICATION_KEY_ID = KEY_ID;
  signer = new LocalFileSigner(CryptoBootstrap.create());
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
  if (savedEnv.keyDir === undefined) delete process.env.PARMANA_KEY_DIR;
  else process.env.PARMANA_KEY_DIR = savedEnv.keyDir;
  if (savedEnv.keyId === undefined)
    delete process.env.PARMANA_VERIFICATION_KEY_ID;
  else process.env.PARMANA_VERIFICATION_KEY_ID = savedEnv.keyId;
});

/** Signs a release exactly as the gateway does, and returns its body. */
async function release(
  businessTransactionId: string,
  parameters: Record<string, unknown>,
  capability = "walmart:place-order",
): Promise<unknown> {
  let body = "";
  const transport: ReleaseTransport = async (sent) => {
    body = sent.body;
    return {
      status: 200,
      body: JSON.stringify({
        businessTransactionId,
        capability,
        success: true,
        result: {},
      }),
    };
  };

  await new GatewayExternalAdapter({
    target: {
      capability,
      endpointUrl: AUDIENCE,
      allowedParameters: Object.keys(parameters),
      timeoutMs: 10_000,
    },
    signer,
    keyId: KEY_ID,
    lookup: async () => [{ address: "203.0.114.10", family: 4 }],
    transport,
    now: () => ISSUED_AT,
  }).execute(
    {
      capability,
      businessTransactionId,
      action: capability,
      target: `walmart://carts/${String(parameters.cartId)}`,
      parameters,
    },
    {
      credential: {} as never,
      timeoutMs: 10_000,
      requestedAt: ISSUED_AT,
      release: {
        authorizationId: `auth-${businessTransactionId}`,
        policy: { name: "walmart-purchase", version: "1.0.0" },
        approvals: [
          {
            approverId: "buyer-1",
            keyId: "buyer-1-key-1",
            approvalId: `approval-${businessTransactionId}`,
          },
        ],
      },
    },
  );

  return JSON.parse(body);
}

const CART = {
  cartId: "cart-1",
  items: [
    { itemId: "paper-a4", quantity: 2 },
    { itemId: "toner-black", quantity: 1 },
  ],
  maxTotal: 100,
};

function setup() {
  const gateway = new MockAgentGateway({ "paper-a4": 9.5, "toner-black": 64 });
  const handle = createWalmartOrderEndpoint({
    publicKeys: { [KEY_ID]: publicKeyPem },
    audience: AUDIENCE,
    gateway,
    now: () => NOW,
  });
  return { gateway, handle };
}

describe("Walmart agent gateway example", () => {
  it("has a policy that passes PolicyValidator", () => {
    const policy = JSON.parse(
      readFileSync(new URL("../policy.json", import.meta.url), "utf8"),
    ) as Policy;

    expect(() => new PolicyValidator().validate(policy)).not.toThrow();
  });

  it("places the order once, at a quote within the approved maximum", async () => {
    const { gateway, handle } = setup();

    const answer = await handle(await release("bt-1", CART));

    expect(answer.status).toBe(200);
    expect(answer.body).toMatchObject({
      businessTransactionId: "bt-1",
      success: true,
      result: { orderId: "WM-1", total: 83, currency: "USD", cartId: "cart-1" },
    });
    expect(gateway.orders.size).toBe(1);
  });

  it("answers a repeated release with its first answer and places nothing more", async () => {
    const { gateway, handle } = setup();
    const body = await release("bt-2", CART);

    const first = await handle(body);
    const again = await handle(body);

    expect(again).toEqual(first);
    expect(gateway.orders.size).toBe(1);
  });

  it("refuses when the price rose above the approved maximum", async () => {
    const { gateway, handle } = setup();
    gateway.priceIncrease = 20;

    const answer = await handle(await release("bt-3", CART));

    expect(answer.status).toBe(200);
    expect(answer.body).toMatchObject({
      success: false,
      result: { quotedTotal: 103, approvedMaxTotal: 100 },
    });
    expect(gateway.orders.size).toBe(0);
  });

  it("answers 502 when the answer is lost, and never places it again on its own", async () => {
    const { gateway, handle } = setup();
    gateway.failNextPlace = "timeout";
    const body = await release("bt-4", CART);

    const lost = await handle(body);
    const resent = await handle(body);

    expect(lost.status).toBe(502);
    expect(resent.status).toBe(409);
    // The order exists once at the vendor; the endpoint did not retry it.
    expect(gateway.orders.size).toBe(1);
  });

  it("refuses malformed parameters without calling the gateway", async () => {
    const { gateway, handle } = setup();

    for (const [id, parameters] of [
      ["bt-5", { ...CART, items: [] }],
      ["bt-6", { ...CART, items: [{ itemId: "paper-a4", quantity: 1.5 }] }],
      ["bt-7", { ...CART, maxTotal: 0 }],
    ] as const) {
      const answer = await handle(await release(id, parameters));

      expect(answer.status).toBe(200);
      expect(answer.body.success).toBe(false);
    }

    expect(gateway.orders.size).toBe(0);
  });

  it("refuses a release for another capability", async () => {
    const { gateway, handle } = setup();

    const answer = await handle(
      await release("bt-8", CART, "walmart:cancel-order"),
    );

    expect(answer.body.success).toBe(false);
    expect(gateway.orders.size).toBe(0);
  });

  it("acts on nothing it cannot verify", async () => {
    const { gateway, handle } = setup();
    const body = (await release("bt-9", CART)) as {
      release: Record<string, unknown>;
    };
    const changed = {
      ...body,
      release: { ...body.release, parameters: { ...CART, maxTotal: 500 } },
    };

    for (const bad of [changed, { release: {} }, "not json", null]) {
      const answer = await handle(bad);
      expect(answer.status).toBe(401);
    }

    expect(gateway.orders.size).toBe(0);
  });

  it("refuses a release made for another endpoint", async () => {
    const gateway = new MockAgentGateway({
      "paper-a4": 9.5,
      "toner-black": 64,
    });
    const handle = createWalmartOrderEndpoint({
      publicKeys: { [KEY_ID]: publicKeyPem },
      audience: "https://orders.example.com/another",
      gateway,
      now: () => NOW,
    });

    const answer = await handle(await release("bt-10", CART));

    expect(answer.status).toBe(401);
    expect(gateway.orders.size).toBe(0);
  });
});
