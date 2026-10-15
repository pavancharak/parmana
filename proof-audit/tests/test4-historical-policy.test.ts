//
// TEST 4: an old proof verifies against the policy version it cites, and a stored
// version cannot be overwritten in place without detection.
//
// The repo's policies/ directory is never modified. Policy edits happen on a temp
// copy of customer-refund, read by a standalone gateway. Proofs are minted by the
// real runtime (which hashes the repo's policies/customer-refund@1.2.0), and the
// temp copy starts byte-identical to it.
//
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { StaticApprovalIssuerRegistry } from "@parmana/approval";
import {
  CryptoBootstrap,
  SignerBootstrap,
  SignerKeyProviderAdapter,
  FileKeyExpiryStore,
  TrustRecordHasher,
  verifyExecutionTrustRecordOffline,
} from "@parmana/crypto";
import { ExecutionGateway } from "@parmana/execution-gateway";
import { MemoryNonceStore } from "@parmana/envelope-verifier";
import { FilePolicyRepository } from "@parmana/policy";

import {
  APPROVER,
  approverKeys,
  buildHarness,
  closeHarness,
  publicKeyPem,
  refundTransaction,
  type Harness,
} from "./helpers.js";
import { createGatewayPublicKey } from "../../packages/api/src/bootstrap/createGatewayPublicKey.js";

vi.mock("../../packages/api/src/bootstrap/createApprovalIssuerRegistry.js", () => ({
  createApprovalIssuerRegistry: () =>
    new StaticApprovalIssuerRegistry([
      { ...APPROVER, publicKey: approverKeys.publicKey, revoked: false },
    ]),
}));

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const cases: Record<string, unknown>[] = [];
const hasher = new TrustRecordHasher(CryptoBootstrap.create());
let harness: Harness;
let tmp: string;
let repo: FilePolicyRepository;
let gateway: ExecutionGateway;
const calls: unknown[] = [];

async function mint(orderId: string) {
  const before = harness.captured.length;
  const prior = harness.mode;
  harness.mode = "capture";
  await request(harness.app).post("/execute").send(await refundTransaction({ orderId, amount: 10000 }));
  harness.mode = prior;
  return harness.captured[before]!;
}

beforeAll(async () => {
  harness = await buildHarness();
  tmp = mkdtempSync(join(tmpdir(), "proof-audit-policy-"));
  cpSync(join(root, "policies/customer-refund"), join(tmp, "customer-refund"), { recursive: true });
  repo = new FilePolicyRepository(tmp);
  const signer = await SignerBootstrap.create();
  gateway = new ExecutionGateway({
    publicKey: await createGatewayPublicKey(signer),
    keyProvider: new SignerKeyProviderAdapter(signer),
    keyExpiryStore: new FileKeyExpiryStore(),
    nonceStore: new MemoryNonceStore(),
    policyRepository: repo,
    // Governance approval is not under test here (Test 2 covers it); stub it out.
    policyApprovalVerifier: { verify: async () => undefined } as any,
    connector: {
      capabilities: { declared: ["paytm:refund"] },
      execute: async (r: unknown) => { calls.push(r); return {}; },
    } as any,
  });
}, 120000);

afterAll(async () => {
  await closeHarness(harness);
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(join(root, "proof-audit/results"), { recursive: true });
  writeFileSync(join(root, "proof-audit/results/test4.json"), JSON.stringify(cases, null, 2));
});

describe("TEST 4: verification against historical policy", () => {
  it("issues a proof under customer-refund@1.2.0 and records what it cites", async () => {
    const p1 = await mint("ORD-HIST-1");
    const cites = { name: p1.authorization.payload.policyName, version: p1.authorization.payload.policyVersion, hash: p1.authorization.payload.policyContentHash };
    cases.push({ step: "issue", cites, verdict: cites.version === "1.2.0" ? "PASS" : "FAIL" });
    expect(cites.version).toBe("1.2.0");
    (globalThis as any).__p1 = p1;
  });

  it("policy changes by ADDING version 1.3.0: the old proof still verifies against 1.2.0 and still cites 1.2.0", async () => {
    const a = JSON.parse(readFileSync(join(tmp, "customer-refund/1.2.0/policy.json"), "utf8"));
    await repo.save("customer-refund", "1.3.0", { ...a, policyVersion: "1.3.0", description: "B: added version" } as any);
    const p1 = (globalThis as any).__p1;
    const before = calls.length;
    let threw = false; let message = "";
    try { await gateway.execute(p1); } catch (e) { threw = true; message = (e as Error).message; }
    const released = calls.length - before;
    cases.push({ step: "old proof vs 1.2.0 after 1.3.0 added", released, rejected: threw, message: message.slice(0, 160), citesAfter: p1.authorization.payload.policyVersion, verdict: released === 1 && p1.authorization.payload.policyVersion === "1.2.0" ? "PASS" : "FAIL" });
    expect(released).toBe(1);
  });

  it("offline: a trust record citing 1.2.0 still verifies after 1.3.0 is added", async () => {
    harness.mode = "release";
    const tx = await refundTransaction({ orderId: "ORD-HIST-TR", amount: 10000 });
    const response = await request(harness.app).post("/execute").send(tx);
    const keys = { default: publicKeyPem() };
    const result = await verifyExecutionTrustRecordOffline(response.body, keys);
    cases.push({ step: "offline trust record after 1.3.0 added", citedVersion: response.body.transaction.policy.version, valid: result.valid, verdict: result.valid && response.body.transaction.policy.version === "1.2.0" ? "PASS" : "FAIL" });
    expect(result.valid).toBe(true);
    (globalThis as any).__tr = response.body;
  });

  it("overwrite test: stored version 1.2.0 rewritten in place through the repository write path", async () => {
    const a = JSON.parse(readFileSync(join(tmp, "customer-refund/1.2.0/policy.json"), "utf8"));
    const p2 = await mint("ORD-HIST-2");
    let overwriteRejected = false; let err = "";
    try { await repo.save("customer-refund", "1.2.0", { ...a, description: "edited in place" } as any); } catch (e) { overwriteRejected = true; err = (e as Error).message; }
    const onDisk = JSON.parse(readFileSync(join(tmp, "customer-refund/1.2.0/policy.json"), "utf8"));
    const overwriteAllowed = !overwriteRejected && onDisk.description === "edited in place";
    cases.push({ step: "overwrite 1.2.0 in place", overwriteRejected, overwriteAllowed, error: err.slice(0, 120), verdict: overwriteAllowed ? "FAIL" : "PASS", note: "no write-time immutability guard exists on FilePolicyRepository.save" });
    (globalThis as any).__p2 = p2;
    expect(true).toBe(true);
  });

  it("a proof issued before the in-place overwrite is refused at release (detection)", async () => {
    const p2 = (globalThis as any).__p2;
    const before = calls.length;
    let threw = false; let message = "";
    try { await gateway.execute(p2); } catch (e) { threw = true; message = (e as Error).message; }
    const released = calls.length - before;
    cases.push({ step: "pre-overwrite proof released after overwrite", rejected: threw, released, message: message.slice(0, 200), verdict: threw && released === 0 ? "PASS" : "FAIL" });
    expect(released).toBe(0);
  });

  it("offline trust record stays signature-valid after the overwrite, but its cited contentHash no longer matches the stored version", async () => {
    const tr = (globalThis as any).__tr;
    const result = await verifyExecutionTrustRecordOffline(tr, { default: publicKeyPem() });
    const current = await repo.load("customer-refund", "1.2.0");
    const currentHash = await hasher.hash(current);
    const citedHash = tr.transaction.policy.contentHash;
    const detectable = currentHash !== citedHash;
    cases.push({ step: "third-party check after overwrite", offlineValid: result.valid, citedHashMatchesStore: currentHash === citedHash, verdict: result.valid && detectable ? "PASS" : "FAIL", note: "offline verification does not look at policy content; detection requires comparing the cited contentHash to the stored policy" });
    expect(detectable).toBe(true);
  });

  it("UNABLE TO TEST: startup governance integrity check", () => {
    cases.push({ step: "startup verifyPolicyGovernanceIntegrityAtStartup", verdict: "UNABLE TO TEST", reason: "requires signed PolicyChangeApprovalRecord rows produced by the maker-checker flow; not reproduced here" });
    expect(true).toBe(true);
  });
});
