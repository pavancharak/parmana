//
// TEST 2: execution requires a valid, current proof.
// External endpoint: MockPaytmConnectorServer (records every call).
// Pass condition for every failing case: the endpoint receives zero calls.
//
import { createPrivateKey, generateKeyPairSync, type KeyObject } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { StaticApprovalIssuerRegistry } from "@parmana/approval";
import { AuthorizationSigner, CryptoBootstrap } from "@parmana/crypto";
import { ExecutionGateway } from "@parmana/execution-gateway";
import { MemoryNonceStore } from "@parmana/envelope-verifier";
import {
  ExecutionControlService,
  GatewayAttestationSigner,
  RandomIdGenerator,
  SystemClock,
} from "@parmana/execution-control";

import {
  APPROVER,
  approverKeys,
  buildHarness,
  closeHarness,
  refundTransaction,
  type Harness,
} from "./helpers.js";
import { createExecutionControl } from "../../packages/api/src/bootstrap/createExecutionControl.js";
import { createGatewayIdentity } from "../../packages/api/src/bootstrap/createGatewayIdentity.js";
import { createGatewayKeyPair } from "../../packages/api/src/bootstrap/createGatewayKeyPair.js";
import { createGatewayPublicKey } from "../../packages/api/src/bootstrap/createGatewayPublicKey.js";
import { createExecutionSystem } from "../../packages/api/src/bootstrap/createExecutionSystem.js";
import { SignerBootstrap, SignerKeyProviderAdapter, FileKeyExpiryStore } from "@parmana/crypto";
import { policyRepository } from "../../packages/api/src/application.js";
import { PAYTM_CONNECTOR_TEST_MODE_PLACEHOLDER_SECRET } from "@parmana/connector-paytm";

vi.mock("../../packages/api/src/bootstrap/createApprovalIssuerRegistry.js", () => ({
  createApprovalIssuerRegistry: () =>
    new StaticApprovalIssuerRegistry([
      { ...APPROVER, publicKey: approverKeys.publicKey, revoked: false },
    ]),
}));

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const resultsDir = join(root, "proof-audit/results");

const cases: Record<string, unknown>[] = [];
const record = (row: Record<string, unknown>) => cases.push(row);

let harness: Harness;
let keyDir: string;
let privateKey: KeyObject;

/** Mints a fresh, never-released proof for a refund (runtime-signed). */
async function mintProof(orderId: string, amount: number) {
  const before = harness.captured.length;
  harness.mode = "capture";
  const tx = await refundTransaction({ orderId, amount });
  await request(harness.app).post("/execute").send(tx);
  harness.mode = "release";
  const captured = harness.captured[before];
  if (captured === undefined) throw new Error("no proof captured");
  return captured;
}

/** Re-signs a payload with the real default key (what a key holder could do). */
async function resign(
  base: any,
  change: (payload: any) => void,
  content: Record<string, unknown> = base,
  opts: { dropPolicyHash?: boolean } = {},
) {
  const payload = JSON.parse(JSON.stringify(base.authorization.payload));
  change(payload);
  if (opts.dropPolicyHash) delete payload.policyContentHash;
  const signer = new AuthorizationSigner(CryptoBootstrap.create());
  const signed = await signer.sign(
    {
      decisionId: payload.decisionId,
      businessTransactionId: payload.businessTransactionId,
      policyName: payload.policyName,
      policyVersion: payload.policyVersion,
      ...(opts.dropPolicyHash ? {} : { policyContentHash: payload.policyContentHash }),
      signalsHash: payload.signalsHash,
      executableContent: {
        businessTransactionId: content.businessTransactionId,
        action: content.action,
        target: content.target,
        parameters: content.parameters,
      },
    } as any,
    privateKey,
    "default",
    120,
  );
  return { ...base, authorization: signed };
}

function tamperedSignature(auth: any) {
  const copy = JSON.parse(JSON.stringify(auth));
  const v = copy.signature as string;
  copy.signature = (v[0] === "A" ? "B" : "A") + v.slice(1);
  return copy;
}

describe("TEST 2: execution requires proof", () => {
  beforeAll(async () => {
    harness = await buildHarness();
    keyDir = process.env.PARMANA_KEY_DIR!;
    privateKey = createPrivateKey(readFileSync(join(keyDir, "default.private.pem"), "utf8"));
  }, 120000);

  afterAll(async () => {
    try {
      rmSync(join(keyDir, "key-expiry.json"), { force: true });
    } catch {}
    await closeHarness(harness);
    mkdirSync(resultsDir, { recursive: true });
    writeFileSync(join(resultsDir, "test2.json"), JSON.stringify(cases, null, 2));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("control: a valid, unreleased proof releases exactly once", async () => {
    const proof = await mintProof("ORD-CTRL", 10000);
    const before = harness.server.paytmInvocationCount;
    const result = await harness.gateway.execute(proof);
    const delta = harness.server.paytmInvocationCount - before;
    record({ path: "paytm:refund via ExecutionGateway", condition: "valid proof (control)", expect: "1 call", observed: `${delta} call(s)`, verdict: delta === 1 ? "PASS" : "FAIL" });
    expect(result).toBeDefined();
    expect(delta).toBe(1);
  });

  it("no proof: request carries no authorization", async () => {
    const proof = await mintProof("ORD-NOPROOF", 10000);
    const before = harness.server.paytmInvocationCount;
    let threw = false;
    try { await harness.gateway.execute({ ...proof, authorization: undefined }); } catch { threw = true; }
    const delta = harness.server.paytmInvocationCount - before;
    record({ path: "paytm:refund via ExecutionGateway", condition: "no proof", rejected: threw, expect: "0 calls", observed: `${delta} call(s)`, verdict: threw && delta === 0 ? "PASS" : "FAIL" });
    expect(delta).toBe(0);
  });

  it("forged proof: signature bytes altered", async () => {
    const proof = await mintProof("ORD-FORGE", 10000);
    const forged = { ...proof, authorization: { ...proof.authorization, signature: tamperedSignature(proof.authorization).signature } };
    const before = harness.server.paytmInvocationCount;
    let threw = false;
    try { await harness.gateway.execute(forged); } catch { threw = true; }
    const delta = harness.server.paytmInvocationCount - before;
    record({ path: "paytm:refund via ExecutionGateway", condition: "forged signature", rejected: threw, expect: "0 calls", observed: `${delta} call(s)`, verdict: threw && delta === 0 ? "PASS" : "FAIL" });
    expect(delta).toBe(0);
  });

  it("expired proof: presented after expiresAt", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-15T10:00:00Z"));
    const proof = await mintProof("ORD-EXP", 10000);
    vi.setSystemTime(new Date(Date.parse(proof.authorization.payload.expiresAt) + 60_000));
    const before = harness.server.paytmInvocationCount;
    let threw = false; let message = "";
    try { await harness.gateway.execute(proof); } catch (e) { threw = true; message = (e as Error).message; }
    const delta = harness.server.paytmInvocationCount - before;
    record({ path: "paytm:refund via ExecutionGateway", condition: "expired proof", rejected: threw, message: message.slice(0, 200), expect: "0 calls", observed: `${delta} call(s)`, verdict: threw && delta === 0 ? "PASS" : "FAIL" });
    vi.useRealTimers();
    expect(delta).toBe(0);
  });

  it("revoked proof: signing key revoked in key-expiry.json", async () => {
    const proof = await mintProof("ORD-REV", 10000);
    writeFileSync(join(keyDir, "key-expiry.json"), JSON.stringify({ default: { revoked: true } }));
    const before = harness.server.paytmInvocationCount;
    let threw = false;
    try { await harness.gateway.execute(proof); } catch { threw = true; }
    const delta = harness.server.paytmInvocationCount - before;
    rmSync(join(keyDir, "key-expiry.json"), { force: true });
    record({ path: "paytm:refund via ExecutionGateway", condition: "revoked proof (signing key revoked)", rejected: threw, expect: "0 calls", observed: `${delta} call(s)`, verdict: threw && delta === 0 ? "PASS" : "FAIL", note: "Revocation is key-level, not per-proof. Per-proof revocation via authority grant is covered by UNABLE TO TEST (see report)." });
    expect(delta).toBe(0);
  });

  it("proof for a different action: another transaction's content under this proof", async () => {
    const a = await mintProof("ORD-A", 10000);
    const b = await mintProof("ORD-B", 2500);
    const mismatched = { ...b, authorization: a.authorization };
    const before = harness.server.paytmInvocationCount;
    let threw = false;
    try { await harness.gateway.execute(mismatched); } catch { threw = true; }
    const delta = harness.server.paytmInvocationCount - before;
    record({ path: "paytm:refund via ExecutionGateway", condition: "proof issued for different action/content", rejected: threw, expect: "0 calls", observed: `${delta} call(s)`, verdict: threw && delta === 0 ? "PASS" : "FAIL" });
    expect(delta).toBe(0);
  });

  it("valid signature, denied decision: payload re-signed with a decision that was not approved", async () => {
    // The runtime never signs a DENIED decision (ExecutionGate.enforce runs
    // before AuthorizationSigner.sign). This simulates a holder of the
    // signing key signing one anyway, to test whether the gateway refuses it.
    const proof = await mintProof("ORD-DENY", 10000);
    const denied = await resign(proof, (p) => { p.decisionId = crypto.randomUUID(); });
    const before = harness.server.paytmInvocationCount;
    let threw = false;
    try { await harness.gateway.execute(denied); } catch { threw = true; }
    const delta = harness.server.paytmInvocationCount - before;
    record({ path: "paytm:refund via ExecutionGateway", condition: "valid signature, denied decision", rejected: threw, expect: "0 calls", observed: `${delta} call(s)`, verdict: threw && delta === 0 ? "PASS" : "FAIL", note: "ExecutionGateway never reads the decision outcome; only the runtime gate does." });
    expect(true).toBe(true); // recorded; a FAIL is reported, not hidden
  });

  // Isolated policy-binding cases. No signalStateVerifier is wired, so the only
  // difference between the two gateways is allowUnverifiedPolicy. (With the
  // production signal verifier wired, a stripped proof is refused by the
  // signal-state check instead, which is incidental and not policy binding.)
  async function gatewayWithoutSignalCheck(allowUnverifiedPolicy: boolean, calls: unknown[]) {
    const signer = await SignerBootstrap.create();
    const publicKey = await createGatewayPublicKey(signer);
    const connector = {
      capabilities: { declared: ["paytm:refund"] },
      execute: async (req: unknown) => { calls.push(req); return {}; },
    } as any;
    return new ExecutionGateway({
      publicKey,
      keyProvider: new SignerKeyProviderAdapter(signer),
      keyExpiryStore: new FileKeyExpiryStore(),
      nonceStore: new MemoryNonceStore(),
      policyRepository,
      policyApprovalVerifier: { verify: async () => undefined } as any,
      connector,
      ...(allowUnverifiedPolicy ? { allowUnverifiedPolicy: true } : {}),
    });
  }

  it("bypass flag ON (allowUnverifiedPolicy): proof with no policyContentHash is accepted", async () => {
    const proof = await mintProof("ORD-FLAGON", 10000);
    const stripped = await resign(proof, () => {}, proof, { dropPolicyHash: true });
    const calls: unknown[] = [];
    const gateway = await gatewayWithoutSignalCheck(true, calls);
    let threw = false;
    try { await gateway.execute(stripped); } catch { threw = true; }
    record({ path: "paytm:refund via ExecutionGateway, allowUnverifiedPolicy=true (the flag createExecutionGateway sets when no policy approval verifier exists, i.e. NODE_ENV=test/development)", condition: "proof without policyContentHash", rejected: threw, expect: "0 calls", observed: `${calls.length} call(s)`, verdict: threw && calls.length === 0 ? "PASS" : "FAIL" });
    expect(true).toBe(true);
  });

  it("bypass flag OFF (production policy binding): the same proof is refused for policy binding", async () => {
    const proof = await mintProof("ORD-FLAGOFF", 10000);
    const stripped = await resign(proof, () => {}, proof, { dropPolicyHash: true });
    const calls: unknown[] = [];
    const gateway = await gatewayWithoutSignalCheck(false, calls);
    let threw = false; let message = "";
    try { await gateway.execute(stripped); } catch (e) { threw = true; message = (e as Error).message; }
    record({ path: "paytm:refund via ExecutionGateway, allowUnverifiedPolicy unset", condition: "proof without policyContentHash", rejected: threw, message: message.slice(0, 160), expect: "0 calls", observed: `${calls.length} call(s)`, verdict: threw && calls.length === 0 ? "PASS" : "FAIL" });
    expect(calls.length).toBe(0);
  });

  it("bypass flag: POLICY_EXECUTION_VERIFICATION_ENFORCED unset in NODE_ENV=test skips governance approval", async () => {
    // Default test wiring: no PolicyChangeApprovalRecord exists for customer-refund@1.2.0,
    // yet a refund proof is released. Recorded as observed behaviour.
    const proof = await mintProof("ORD-NOGOV", 10000);
    const before = harness.server.paytmInvocationCount;
    let threw = false;
    try { await harness.gateway.execute(proof); } catch { threw = true; }
    const delta = harness.server.paytmInvocationCount - before;
    record({ path: "paytm:refund via ExecutionGateway", condition: "no policy governance approval record, flag unset (NODE_ENV=test default)", rejected: threw, expect: "0 calls", observed: `${delta} call(s)`, verdict: threw || delta === 0 ? "PASS" : "FAIL" });
    expect(true).toBe(true);
  });

  it("bypass flag ON: POLICY_EXECUTION_VERIFICATION_ENFORCED=true refuses a refund with no governance approval", async () => {
    const previous = process.env.POLICY_EXECUTION_VERIFICATION_ENFORCED;
    process.env.POLICY_EXECUTION_VERIFICATION_ENFORCED = "true";
    let enforced: Harness | undefined;
    try {
      enforced = await buildHarness();
      enforced.mode = "release";
      const tx = await refundTransaction({ orderId: "ORD-ENFORCED", amount: 10000 });
      const response = await request(enforced.app).post("/execute").send(tx);
      const calls = enforced.server.paytmInvocationCount;
      record({ path: "paytm:refund via POST /execute, POLICY_EXECUTION_VERIFICATION_ENFORCED=true", condition: "no PolicyChangeApprovalRecord for customer-refund@1.2.0", rejected: response.status !== 200, message: String(response.body?.error ?? "").slice(0, 160), expect: "0 calls", observed: `${calls} call(s)`, verdict: response.status !== 200 && calls === 0 ? "PASS" : "FAIL" });
      expect(calls).toBe(0);
    } finally {
      if (previous === undefined) delete process.env.POLICY_EXECUTION_VERIFICATION_ENFORCED;
      else process.env.POLICY_EXECUTION_VERIFICATION_ENFORCED = previous;
      if (enforced) await closeHarness(enforced);
    }
  });

  it("bypass path: ExecutionControl.execute trusts caller-supplied verification flags (in-process)", async () => {
    // Holder of the in-process gateway attestation key calls the release
    // service directly with an UNSIGNED authorization and verified:true flags.
    // Pin the connector endpoint to the recording server: createExecutionControl()
    // reads PAYTM_CONNECTOR_URL at construction, and other harnesses overwrite it.
    process.env.PAYTM_CONNECTOR_URL = harness.server.baseUrl;
    process.env.TEST_PAYTM_CONNECTOR_SHARED_SECRET = PAYTM_CONNECTOR_TEST_MODE_PLACEHOLDER_SECRET;
    const control = createExecutionControl();
    const identity = createGatewayIdentity();
    const gatewayKey = createGatewayKeyPair().privateKey;
    const attest = new GatewayAttestationSigner(new SystemClock(), new RandomIdGenerator());
    const fake: any = {
      payload: { authorizationId: crypto.randomUUID(), nonce: "x", decisionId: "x", businessTransactionId: crypto.randomUUID(), policyName: "customer-refund", policyVersion: "1.2.0", businessTransactionHash: "0", authorizedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60000).toISOString() },
      signature: "bm90LWEtc2lnbmF0dXJl",
      keyId: "default",
      algorithm: "ed25519",
    };
    const before = harness.server.paytmInvocationCount;
    let threw = false; let message = "";
    try {
      await control.execute({
        authorization: fake,
        executableContent: { businessTransactionId: fake.payload.businessTransactionId, action: "paytm:refund", target: "paytm://orders/ORD-FORGED", parameters: { orderId: "ORD-FORGED", transactionId: "T", amount: 999999 } },
        verifiedTransaction: { authorizationVerified: true, executableContentVerified: true, replayCheckPassed: true },
        executionTimestamp: new Date().toISOString(),
        approvals: [],
      } as any, attest.sign(identity.gatewayId, fake.payload.authorizationId, gatewayKey));
    } catch (e) { threw = true; message = (e as Error).message; }
    const delta = harness.server.paytmInvocationCount - before;
    record({ path: "paytm:refund via ExecutionControl.execute (bypasses ExecutionGateway.verify)", condition: "unsigned authorization, caller-set verified flags, in-process attestation", rejected: threw, message: message.slice(0, 200), expect: "0 calls", observed: `${delta} call(s)`, verdict: threw && delta === 0 ? "PASS" : "FAIL" });
    expect(true).toBe(true);
  });
});
