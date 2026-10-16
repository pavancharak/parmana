# Parmana proof audit

> **Status update (after fixes).** The sections below describe the state the audit first measured. The Critical and High findings have since been fixed, and the audit cases now pass: decision outcome bound into the signed authorization (B17), independent release verification in the execution control (B5), governance relaxation only with an explicit opt-in (B1 to B3), immutable published policy versions (B16), an anchored audit chain head (Test 5), HubSpot verification fetch bound to the policy hash, and production refusal of `PARMANA_AUTH_DISABLED` and `PARMANA_SANDBOX` (B13, B14). Still open: head anchoring is an operator step, per-authorization revocation, the HubSpot helper's self-asserted `APPROVED` (B17 trust root), end-to-end audits for HubSpot/GitHub/Slack/external connectors, the offline verifier's `.env` load, and startup governance integrity (UNABLE TO TEST). The public summary is at `docs/site/evaluation/proof-audit.mdx`.

Scope: the five claims in the audit brief, tested against this repository at commit `3e676ef` (branch `ccr-6f1b8d3b-o5pqwj`).
No production code was changed. Everything added lives under `proof-audit/`. Build output (`dist/`) and `node_modules/` are gitignored.

Important: the vitest suite is green (49/49) because it runs the audit, not because every claim holds. The claim verdicts are the `PASS`/`FAIL` rows in `proof-audit/results/*.json`. Several of those rows are `FAIL`, and they are reported below.

---

## 1. Summary

| # | Claim | Verdict | Reason |
|---|-------|---------|--------|
| 1 | Third party verifies a proof with no service, database or private key access | **VERIFIED** (scoped to the Execution Trust Record bundle) | 13/13 cases passed: unmodified proof verified in a fresh process with an empty environment, no key files, network denied in-process and in an empty network namespace; all 9 field changes failed. Caveat: the verifier process still reads `<repo>/.env` on import (see §5). |
| 2 | An external action cannot occur without a valid, current proof | **FALSIFIED** | 4 of 12 cases released an external call: a validly signed authorization whose decision was not approved; a proof without a policy hash when `allowUnverifiedPolicy` is on; a refund with no governance approval in the default test-mode wiring; and an unsigned authorization submitted through the in-process `ExecutionControl` service. Paytm path only; other connectors not executed. |
| 3 | A proof authorizes only the exact parameters it was issued for | **VERIFIED** (scoped to the Paytm refund path, gateway and API level) | 10/10 recorded checks passed: amount, target, recipient identifiers, action/connector, operation, out-of-window reuse, gateway replay and API replay all rejected with zero extra external calls. |
| 4 | Old proofs verify against the policy version they cite, and stored versions cannot be overwritten in place | **FALSIFIED** (the in-place overwrite requirement) | Adding version 1.3.0 leaves a 1.2.0 proof releasable (PASS), but `FilePolicyRepository.save` overwrote 1.2.0 with no guard (FAIL). Release-time detection works (PASS). Startup integrity check: UNABLE TO TEST. |
| 5 | Altering or deleting a stored audit record is detectable | **FALSIFIED** (deleting the newest record) | 6 of 7 trials detected: content edit, middle deletion, two reorder forms, recomputed-hash edit, first-record deletion. Deleting the last record is not detected because the chain has no external head anchor. |

Other notes:
- Test 2 is recorded as FALSIFIED under the brief's own rule ("a single FAIL on any path means the claim is FALSE for the repository").
- Claims 3 and 1 are verified only for the paths and artifacts named in the table. The brief's "do not describe a claim as verified" rule is applied to those scopes.

---

## 2. Step 0 map

### 2.1 External action paths

Wired in the production bootstrap (`packages/api/src/bootstrap/createConnectorRegistry.ts`). Each connector is registered only when its environment variables are set. Every path below sits behind `ExecutionGateway.execute` (`packages/execution-gateway/src/ExecutionGateway.ts:638`).

| Path | Function (file:line) | Endpoint / effect | Registered when |
|------|----------------------|-------------------|-----------------|
| Paytm refund | `GatewayPaytmAdapter.execute` (`connector-execution/GatewayPaytmAdapter.ts:227`) | `POST {PAYTM_CONNECTOR_URL}/connector/paytm-refund` (money movement, via trusted out-of-process service) | `PAYTM_CONNECTOR_URL` + `PAYTM_CONNECTOR_SHARED_SECRET` |
| HubSpot deal update | `GatewayHubSpotAdapter.hubspotPatch` (`:245`), `hubspotGet` (`:231`) | HubSpot CRM writes and reads | `HUBSPOT_PRIVATE_APP_TOKEN` |
| GitHub PR merge | `GatewayGitHubAdapter.mergePullRequest` (`connector-execution/GatewayGitHubAdapter.ts:197`), `githubGet` (`:222`); token fetch `GitHubAppCredentialProvider.resolve` (`GitHubAppCredentialProvider.ts:65`) | GitHub writes and reads | `GITHUB_APP_ID`, `GITHUB_INSTALLATION_ID`, `GITHUB_APP_PRIVATE_KEY` |
| Slack post | `GatewaySlackAdapter.execute` (`connector-execution/GatewaySlackAdapter.ts:147`) | Slack message | `SLACK_BOT_TOKEN` |
| External connector (ADR-0013) | `GatewayExternalAdapter` with pinned HTTPS (`GatewayExternalAdapter.ts:447`), selected by `ExternalConnectorAwareRegistry.resolveCapability` (`connector-execution/ExternalConnectorAwareRegistry.ts:80`) | Any capability with an active registration, to a registered `endpointUrl` | Runtime registration via `/external-connectors/changes` (maker-checker routes, `routes/external-connectors.ts`) |

Exported but **not** wired in any production bootstrap: `GatewayHttpAdapter.execute` (`GatewayHttpAdapter.ts:84`), `HttpConnector.execute` (`HttpConnector.ts:29`), `HttpExecutionSystem.execute` (`packages/execution-system/src/HttpExecutionSystem.ts:21`). Grep found no production caller that constructs them.

Test-only: `createTestFixtureConnector` (`packages/api/src/bootstrap/createTestFixtureConnector.ts:25`) registers a `MockConnector` for `test:fixture-execute` only when `NODE_ENV=test`.

### 2.2 Decision, proof, verification, release, audit

| Stage | Location |
|-------|----------|
| Decision | `DecisionBuilder` inside `RuntimeEngine.execute` (`packages/runtime/src/RuntimeEngine.ts`) |
| Gate | `ExecutionGate.enforce` (`packages/runtime/src/ExecutionGate.ts:23`), called at `RuntimeEngine.ts:760`. Checks only `decision.outcome === APPROVED`. |
| Proof creation | `RuntimeEngine.ts:777` → `AuthorizationSigner.sign` (`packages/crypto/src/AuthorizationSigner.ts:55`) → `ArtifactSigner` → `Signer` (`LocalFileSigner` or `KmsSigner`) chosen by `SignerBootstrap.create` (`packages/crypto/src/SignerBootstrap.ts`) |
| Proof verification at release | `ExecutionGateway.verify` (`ExecutionGateway.ts:304`) → `EnvelopeVerifier.verifyChecks` / `consumeNonce` (`packages/envelope-verifier/src/EnvelopeVerifier.ts`) → `AuthorizationVerifier.verify` (`packages/crypto/src/AuthorizationVerifier.ts:69`) |
| Proof verification by a third party | `verifyExecutionTrustRecordOffline` (`packages/crypto/src/OfflineVerifier.ts:131`) |
| Release | `ExecutionComponent.execute` (`packages/runtime/src/components/ExecutionComponent.ts:76`) → `ExecutionGateway.execute` (`ExecutionGateway.ts:638`) → `ExecutionControlService.execute` (`packages/execution-control/src/ExecutionControlService.ts:57`) → connector |
| Caller audit write | `SupabaseCallerAuditSink.record` (`packages/api/src/auth/SupabaseCallerAuditSink.ts:122`), chained per caller |
| Execution audit write | `ExecutionControlService` `audit.record` (`ExecutionControlService.ts:73, 102, 114`) → `SupabaseExecutionAuditSink` (production) or `MemoryExecutionAuditSink` (`NODE_ENV=test`) |
| Caller audit chain verify | `CallerAuditChainVerifier.verifyChain` (`packages/crypto/src/CallerAuditChainVerifier.ts:59`) |
| Replay endpoint | `ExecutionTrustApplication.replay` (`packages/runtime/src/ExecutionTrustApplication.ts:143`) only re-verifies the stored record. It does not release anything. |

### 2.3 Bypass and alternate-path inventory

Every entry is treated as a potential bypass. Status column: tested result in §3, or NOT TESTED with reason.

| ID | Mechanism | Location | Effect | Status |
|----|-----------|----------|--------|--------|
| B1 | `allowUnverifiedPolicy` (gateway option) | `ExecutionGateway.ts:131` (option), `:264` (`requirePolicyBinding`), `:489` (`policyBindingOk`) | Authorizations without `policyContentHash` are accepted; policy hash and governance are not required | **FAIL** when on (Test 2) |
| B2 | Set automatically when no policy approval verifier exists | `packages/api/src/bootstrap/createExecutionGateway.ts:108-110` | Same as B1 | Tested through B1 |
| B3 | `NODE_ENV` in `{test, development}` relaxes governance | `packages/api/src/bootstrap/createPolicyExecutionVerifier.ts:28-34` | Returns no verifier, so no `PolicyChangeApprovalRecord` is checked | **FAIL** in default test wiring (Test 2) |
| B4 | `POLICY_EXECUTION_VERIFICATION_ENFORCED=true` | `createPolicyExecutionVerifier.ts:31` (read only when `NODE_ENV` is test/development) | Re-enables governance | **PASS** when set (Test 2) |
| B5 | In-process `ExecutionControlService.execute` trusts caller-set `verifiedTransaction` flags | `ExecutionControlService.ts:57`; flags set by the gateway at `ExecutionGateway.ts:681-685` | Any holder of the gateway attestation key can release without a valid authorization | **FAIL** (Test 2) |
| B6 | Gateway attestation key loaded into the same process | `packages/api/src/bootstrap/createGatewayKeyPair.ts:50` (`<gateway>.private.pem`) | Enables B5 | Same as B5 |
| B7 | `legacyInsecure` (connector registry option) | `packages/execution-gateway/src/connector-execution/GatewayConnectorRegistry.ts:154` (skips session credential and audit requirement) | Connector runs without single-use session credential or audit sink | NOT TESTED end-to-end. No production caller sets it (grep: only `tests/` do). |
| B8 | `NODE_ENV=test` nonce store | `packages/api/src/bootstrap/createNonceStore.ts:29` (`MemoryNonceStore`) | Replay protection lost on restart; production uses Postgres (fails closed without `DATABASE_URL`) | Replay tested in memory (Test 3). Production nonce store NOT TESTED. |
| B9 | `NODE_ENV=test` execution audit sink | `packages/api/src/bootstrap/createExecutionAuditSink.ts:34` (`MemoryExecutionAuditSink`) | No tamper evidence in test wiring | Not a claim-level bypass; noted |
| B10 | `NODE_ENV=test` memory storage | `packages/storage/src/StorageFactory.ts:79` | Test data path only | Noted |
| B11 | Signal-divergence check fails open before binding | `packages/api/src/bootstrap/executionGatewaySignalStateVerifier.ts` (`LateBoundSignalStateVerifier`, returns `[]` until `bind()`) | Real-world divergence check skipped during bootstrap window. Hash check still runs. | Not tested (startup window) |
| B12 | Signal check skipped when authorization has no `signalsHash` | `ExecutionGateway.ts` (signals block, legacy path) | Legacy authorizations skip signal freshness | Not tested |
| B13 | `PARMANA_AUTH_DISABLED=true` | `packages/shared/src/config/Config.ts:381`; `packages/api/src/bootstrap/createCallerAuthenticator.ts:23-33` (warns); caller checks skipped when `req.callerId` is undefined in `packages/api/src/routes/execute.ts` | Disables caller identity, principal, capability and tenant checks. Does **not** skip the proof gate (it runs downstream). | Not a proof bypass. The audit harness runs with it disabled, as the existing integration tests do. |
| B14 | `PARMANA_SANDBOX=true` | `packages/api/src/bootstrap/createSandboxOptions.ts:43-46, 69`; mounted at `packages/api/src/app.ts:350` | Mounts `POST /sandbox/approvals`, which signs approvals with `PARMANA_SANDBOX_APPROVER_PRIVATE_KEY`. Approval-gated policies can then be satisfied server-side. Refused alongside `PARMANA_AUTH_DISABLED=true`. | NOT TESTED |
| B15 | External connector registration | `ExternalConnectorAwareRegistry.ts:80-95`; governed by `routes/external-connectors.ts` (`/changes`, approve/reject) | Any approved capability can route to an arbitrary registered HTTPS endpoint | NOT TESTED |
| B16 | Governance can rewrite an existing policy version | `packages/api/src/governance/PolicyChangeApprovalService.ts:67` (`writeVersion = proposedContent.policyVersion`), `:89` and `:167` (`save`); `packages/policy/src/FilePolicyRepository.ts:98` (`save`, no write-time guard) | Stored version replaced in place | **FAIL** (Test 4) |
| B17 | Gateway does not read the decision outcome | `ExecutionGateway.verify` (`ExecutionGateway.ts:304`); the signed payload (`AuthorizationSigner.buildPayload`) holds `decisionId` only | Any authorization with a valid signature releases; only the runtime `ExecutionGate` (`RuntimeEngine.ts:760`) stops denied decisions | **FAIL** (Test 2) |
| B18 | Test-only approver trust | `vitest.setup.ts` (mocks `createApprovalIssuerRegistry`); `test-support/approvals.ts` | Trusts hermetic test approver in tests only | Test-only; not production |

### 2.4 Key material

| Key | Where loaded from | Who can use it |
|-----|-------------------|----------------|
| Authorization and trust-record signing key (`keyId=default`), `KEY_PROVIDER=local` | `packages/crypto/src/providers/key/FileKeyProvider.ts:141`: `createPrivateKey(readFileSync(<PARMANA_KEY_DIR>/default.private.pem))`, via `LocalFileSigner` | The Parmana API process. Any code in that process can sign. |
| Same key, `KEY_PROVIDER=aws-kms` | `packages/crypto/src/providers/signer/KmsSigner.ts:174` calls AWS KMS; no local private key | KMS IAM principal. The gateway process calls KMS. Not exercised here (no AWS calls were made). |
| Gateway attestation key (`gateway.private.pem` or `PARMANA_GATEWAY_KEY_ID`) | `packages/api/src/bootstrap/createGatewayKeyPair.ts:50` from `PARMANA_KEY_DIR` | The same process. Used to mint attestations for `ExecutionControl` (B5, B6). |
| Key expiry and revocation | `<PARMANA_KEY_DIR>/key-expiry.json` (`packages/crypto/src/KeyExpiry.ts`, read on each lookup) | Operator-managed file |
| Sandbox approver private key | env `PARMANA_SANDBOX_APPROVER_PRIVATE_KEY` (`createSandboxOptions.ts`) | Only with `PARMANA_SANDBOX=true` (B14) |
| GitHub App private key | env `GITHUB_APP_PRIVATE_KEY` (`packages/connector-github/src/GitHubAppJwt.ts`) | Connector process |
| Paytm connector shared secret | env `PAYTM_CONNECTOR_SHARED_SECRET` | Transport authentication to the Paytm service. Not a signing key. |
| Approver keys | Not held by Parmana in production. Parmana holds approver public keys in the approval-issuer registry. | Approvers |

Whether the AI agent can reach a signing key: no route in `packages/api/src/routes/keys.ts` returns private material (grep found no `private` in that file). The agent is documented as an HTTP client. Whether the agent process shares a host or process with the API was not established from this repo, so this is an assumption (see §5).

---

## 3. Test results

### 3.1 Environment and commands

```
npm ci --ignore-scripts --no-audit --no-fund --loglevel=error
# -> added 760 packages. Node here is v22.22.0; package engines require >=24 (EBADENGINE warnings only).

node node_modules/typescript7/bin/tsc -b
# -> EXIT=0. Builds the workspace dist/ that the packages resolve to.

npx vitest run packages/api/tests/integration/paytm-refund.integration.test.ts
# -> baseline before the audit: 18 passed (after the build)

npx vitest run proof-audit/tests > proof-audit/results/vitest-run.log
# -> Test Files 5 passed, Tests 49 passed. Claim verdicts: proof-audit/results/test{1..5}.json
```

Fixed before reporting (harness bugs, not findings): a missing `await` on policy writes; a pointer to a closed mock endpoint in the in-process bypass case; a wrong field path for the decision and authorization signature in the Test 1 tamper cases; and a `signer` constructor argument. Each was corrected and the case rerun. The final verdicts come from the final run.

### 3.2 Test 1: independent verification (13 cases, all PASS)

Proof source: a real `POST /execute` with Paytm refund `customer-refund@1.2.0`, `amount=10000`, which released to the recording endpoint once. Exported files in `proof-audit/artifacts/test1/`: `proof.json` (the Execution Trust Record, which includes the signed authorization), `public-keys.json` (SPKI PEM for `default`, no private material), `policy-version.json` (`customer-refund@1.2.0` and its content hash).

Verifier: `proof-audit/verify/verify-offline.mjs`. It imports only the built `@parmana/crypto` package and runs with:

```
env -i PATH=$PATH NODE_OPTIONS=--import=file:///…/proof-audit/verify/deny-network.mjs \
  unshare -rn node verify-offline.mjs proof.json public-keys.json policy-version.json
```

`deny-network.mjs` blocks `net`, `dns`, `http(s)`, `fetch`, and any `readFileSync` of a path containing `private`, and reports the blocked attempts on exit.

Positive result (`results/test1.json`):

```
{"valid":true,"errors":[],"algorithmsChecked":["ed25519"],"citedPolicy":"customer-refund@1.2.0","envKeys":2}
PROOF_AUDIT_BLOCKED:[]
```

Reachability (same hook, control vs. isolated):

- Test process to the recording endpoint: `reachable` (control)
- Verifier process, in-process hook: `blocked:proof-audit: blocked fetch`
- Verifier process, `unshare -rn` (empty netns): `blocked:fetch failed`

Tamper results (each changed field, verified in a fresh process; expected invalid):

| Field changed | Result | Error reported |
|---|---|---|
| decision (`executions[0].decision.outcome` APPROVED→DENIED) | PASS (exit 1, invalid) | trustRecordHash mismatch; signature failed |
| amount (`intent.parameters.amount` 10000→15000) | PASS | trustRecordHash mismatch; signature failed |
| action ID (`businessTransactionId`) | PASS | trustRecordHash mismatch; signature failed |
| action ID (`authorization.payload.authorizationId`) | PASS | trustRecordHash mismatch; signature failed |
| timestamp (`authorization.payload.authorizedAt` +1 s) | PASS | trustRecordHash mismatch; signature failed |
| policy version (`transaction.policy.version` 1.2.0→1.2.1) | PASS | trustRecordHash mismatch; signature failed |
| policy version (`authorization.payload.policyVersion`) | PASS | trustRecordHash mismatch; signature failed |
| signature (trust record) | PASS | signature verification failed |
| signature (authorization) | PASS | trustRecordHash mismatch (caught transitively; see §5) |

Note on the authorization-signature row: the envelope's own signature was not checked separately in the fresh process. It is covered because the trust record's canonical view includes the authorization.

### 3.3 Test 2: execution requires proof (12 recorded cases)

Path: Paytm refund through `ExecutionGateway` with the production bootstrap. External endpoint: `MockPaytmConnectorServer`, which counts every request it receives. For each failing case the expected count is 0.

Proofs were minted by the real runtime in capture mode (signed, then not released). Re-signed variants use the real default key in the test process, to model a key holder.

| Case | Condition | Rejected | Endpoint calls | Verdict |
|---|---|---|---|---|
| Control | valid, unreleased proof | n/a | 1 | PASS |
| No proof | `authorization` removed | yes | 0 | PASS |
| Forged proof | signature bytes altered | yes | 0 | PASS |
| Expired proof | presented 60 s after `expiresAt` (fake Date) | yes (`notExpired`) | 0 | PASS |
| Revoked proof | signing key revoked in `key-expiry.json` | yes | 0 | PASS |
| Different action | another transaction's content under this proof | yes (`businessTransactionHashMatches`) | 0 | PASS |
| Valid signature, denied decision | re-signed with a non-approved `decisionId` | **no** | **1** | **FAIL** |
| Bypass flag ON: `allowUnverifiedPolicy` | proof without `policyContentHash`, no signal verifier | **no** | **1** | **FAIL** |
| Bypass flag OFF: production policy binding | same proof, same gateway, flag unset | yes (`policyStillCurrent`) | 0 | PASS |
| Bypass: governance flag unset (NODE_ENV=test) | refund for `customer-refund@1.2.0`, no `PolicyChangeApprovalRecord` | **no** | **1** | **FAIL** |
| Bypass flag ON: `POLICY_EXECUTION_VERIFICATION_ENFORCED=true` | same refund | yes ("has no PolicyChangeApprovalRecord") | 0 | PASS |
| In-process `ExecutionControl.execute` | unsigned authorization, caller-set `verifiedTransaction` flags, attestation minted with the in-process gateway key | **no** | **1** | **FAIL** |

Notes:
- The first version of the "policy hash absent" cases was rejected by the signal-state check, not by policy binding. That result was incidental. The rewritten cases use a gateway with no signal verifier so the flag is isolated.
- The "in-process" case is measured at the Paytm endpoint. `createExecutionControl()` reads `PAYTM_CONNECTOR_URL` at construction, so the test pins it to the recording endpoint first.
- The HubSpot, GitHub, Slack, generic HTTP and external-connector paths were not executed. They share `ExecutionGateway` and so are covered by the same gate, but no proof was run through them (see §5).

### 3.4 Test 3: binding to the exact action (10 recorded checks, all PASS)

One valid proof per case. Endpoint: recording Paytm stand-in. Expected: rejection with zero extra calls.

| Case | Result |
|---|---|
| Control: unmodified proof | accepted, 1 call (PASS) |
| Different amount (10000 issued, 15000 executed) | rejected, `businessTransactionHashMatches` (PASS) |
| Different target / recipient (`paytm://orders/ORD-ATTACKER`) | rejected, hash mismatch (PASS) |
| Different recipient identifiers in parameters (`orderId`, `transactionId`) | rejected, hash mismatch (PASS) |
| Different connector (`paytm:refund` → `test:fixture-execute`) | rejected, hash mismatch (PASS) |
| Different operation (`operation: "void"` added) | rejected, hash mismatch (PASS) |
| Out-of-window reuse (never executed, presented after `expiresAt`) | rejected, `notExpired` (PASS) |
| Replay step 1: first use | accepted, 1 call (PASS) |
| Replay step 2: same proof again | rejected, "nonce has already been consumed" (PASS) |
| Replay at API: same business transaction posted twice | second request non-200, total 1 call (PASS) |

Caveat: for the "different connector" case, the test checks that the proof is refused and that the Paytm endpoint is not called. The `test:fixture-execute` target is not separately counted.

### 3.5 Test 4: historical policy (7 recorded checks)

Setup: a temp copy of `policies/customer-refund` (the repo's `policies/` directory is untouched; `git status` shows only `proof-audit/`). A standalone gateway reads the temp copy through `FilePolicyRepository`. Governance approval is stubbed in this test; Test 2 covers governance.

| Step | Result |
|---|---|
| Issue a proof under `customer-refund@1.2.0`; record cited version and hash | PASS (cites `1.2.0`) |
| Add `1.3.0`; the old proof still releases, still cites `1.2.0` | PASS (1 call) |
| Offline trust record citing 1.2.0 still verifies after 1.3.0 is added | PASS (valid) |
| Overwrite stored `1.2.0` in place through `FilePolicyRepository.save` | **FAIL**: write accepted, no guard (`overwriteAllowed: true`) |
| Proof issued before the overwrite is presented after it | PASS: refused, `policyContentHash mismatch: expected 2a3a95…` (0 calls) |
| Third-party check after overwrite: offline record still valid; cited `contentHash` no longer matches stored `1.2.0` | PASS (detectable by a third party who compares hashes) |
| Startup governance integrity check (`verifyPolicyGovernanceIntegrityAtStartup`) | **UNABLE TO TEST**: requires signed `PolicyChangeApprovalRecord` rows from the maker-checker flow, which this audit did not reproduce |

### 3.6 Test 5: audit log tamper evidence (8 recorded checks, 7 PASS, 1 FAIL)

Writer: the real `SupabaseCallerAuditSink.record()` (`packages/api/src/auth/SupabaseCallerAuditSink.ts`), with its pg-style pool backed by PGlite (real PostgreSQL compiled to WASM). Table DDL was reconstructed from the migrations: the `INSERT` column list and the `LAST_CALLER_CHAIN_LINK_SQL` columns. Six events for one caller, written through the sink. Verifier: `CallerAuditChainVerifier.verifyChain`.

| Trial | Verifier result | Verdict |
|---|---|---|
| Untouched chain of 6 | valid | PASS (baseline) |
| Modify content of record 3 (`reason`) | invalid, signature does not match | PASS (detected) |
| Delete middle record 3 | invalid, `previousChainHash` linkage | PASS (detected) |
| Reorder two records (stored `chain_position` swapped) | invalid, signature | PASS (detected) |
| Reorder two records (rows presented swapped) | invalid, linkage | PASS (detected) |
| Edit record 3 and recompute every chain hash, no re-signing | invalid, signature | PASS (detected) |
| Delete the **last** record (tail truncation) | **valid** | **FAIL** (not detected) |
| Delete the first record | invalid, linkage | PASS (detected) |

Detection depends only on internal consistency (signatures under the deployment key, and hash linkage). No external anchor exists. Tail truncation is undetectable from the chain alone.

---

## 4. Bypass findings

Ordered by severity. Each finding references a `FAIL` case.

1. **Decision outcome is not bound to the proof (B17).** `ExecutionGateway.verify` (`packages/execution-gateway/src/ExecutionGateway.ts:304`) checks the signature, expiry, content hash, policy hash, signals and grant. It never reads a decision outcome, and the signed payload contains only `decisionId`. A validly signed authorization for a non-approved decision is released (Test 2: "valid signature, denied decision", 1 call). The only protection is the runtime gate (`RuntimeEngine.ts:760`, `ExecutionGate.enforce`) running before `authorizationSigner.sign` (`RuntimeEngine.ts:777`). Anyone who can sign outside that path defeats it.

2. **In-process release bypass (B5, B6).** `ExecutionControlService.execute` (`packages/execution-control/src/ExecutionControlService.ts:57`) accepts a `release` whose `verifiedTransaction` flags it trusts, and does not re-verify the authorization. The gateway sets those flags to `true` (`ExecutionGateway.ts:681-685`). The only gate is the gateway attestation, which `createGatewayKeyPair.ts:50` loads into the same process. Test 2 released with an unsigned authorization (1 call).

3. **Policy binding and governance are off in NODE_ENV test or development (B1, B2, B3).** `createPolicyExecutionVerifier.ts:28-34` returns no verifier for `test` and `development` unless `POLICY_EXECUTION_VERIFICATION_ENFORCED=true`, and `createExecutionGateway.ts:108-110` then sets `allowUnverifiedPolicy`. Test 2 confirmed both: a proof with no `policyContentHash` is released (1 call), and a refund with no governance approval record is released (1 call). Setting `POLICY_EXECUTION_VERIFICATION_ENFORCED=true` refuses it (PASS). Production wiring is fail-closed (`createPolicyExecutionVerifier.ts`, `ExecutionGateway.ts:264`). These findings apply to any deployment whose `NODE_ENV` is `test` or `development`.

4. **Governance can rewrite a stored policy version in place (B16).** `PolicyChangeApprovalService.ts:67` takes the write version from the proposed content, and `save` (`:89`, `:167`) writes to the same path. `FilePolicyRepository.save` (`packages/policy/src/FilePolicyRepository.ts:98`) has no check that the version already exists. Test 4 overwrote `1.2.0` with no error. Detection exists at release (the old proof was refused) and offline (the cited hash no longer matches the stored policy), but nothing prevents the write.

5. **Audit log tail truncation is undetectable (Test 5).** `CallerAuditChainVerifier` (`packages/crypto/src/CallerAuditChainVerifier.ts:59`) has no head anchor. Deleting the newest record leaves a shorter, internally consistent chain that verifies.

6. **Per-proof revocation does not exist.** Revocation is key-level (`key-expiry.json`, Test 2 "revoked proof" PASS) or grant-level (RFC-0023, `ExecutionGateway.checkAuthorityGrant`). Nothing revokes a single authorization. The default authorization lifetime observed in the harness is 120 s. Authority-grant revocation was not tested (see §5).

7. **Unverified or unexecuted paths (NOT TESTED):** `legacyInsecure` (B7), sandbox approvals (B14), external connector registration (B15), signal check before binding (B11), production nonce store and execution audit sink (B8, B9). Each is listed in §2.3 with its reason.

8. **Dependency on `NODE_ENV` for security posture.** Several of the relaxations above (B1 to B3, B8, B9) are selected by `NODE_ENV` alone. Nothing in the proof path refuses to start when `NODE_ENV` is test or development while keys and a database are configured.

---

## 5. Limits and assumptions

What could not be tested, and why:
- **Other external connectors** (HubSpot, GitHub, Slack, generic HTTP, external connector) were not executed. Each needs its own policy, signals, mock endpoint and credentials. The gate is shared, so Test 2 and Test 3 results for the Paytm path are evidence about that gate, not about each connector's own checks.
- **Production storage was not exercised.** Nonce store (`SupabaseNonceStore`) and execution audit sink (`SupabaseExecutionAuditSink`) were not run. Test 5 used PGlite with a reconstructed caller-audit table (CHECK constraints omitted). The execution audit chain was not tested.
- **KMS signing was not exercised.** No AWS calls were made in this audit (no credentials used, per the brief and CLAUDE.md secret-handling rules).
- **Authority-grant revocation** (RFC-0023) was not exercised. It needs grants created through the governed API.
- **Startup governance integrity check** was not exercised (requires signed approval records). See Test 4.
- **Caller authentication was disabled** in the harness (`callerAuth: "disabled"`, as the existing integration tests do). Caller scoping (principal, capability, tenant) was not audited. The proof gate runs downstream of those checks, so the results above do not depend on them.
- **Attacker models.** The harness "attacker" who re-signs (Test 2 denied-decision case) holds the default private key in the test process. That models a compromised signer. It does not show that a deployed attacker can obtain the key.
- **The fresh-process verifier is not fully hermetic.** `verify-offline.mjs` imports `@parmana/crypto`, which imports `@parmana/shared`, whose `Config.ts` calls `dotenv.config()` at load (`packages/shared/src/config/Config.ts:73-77`). The fresh process therefore reads `<repo>/.env` if one exists. The verifier does not use anything it reads, and it loads no key material, but the verifier is not isolated from the filesystem. The vitest output `◇ injected env (0) from .env` confirms the load.
- **Assumed:** `MockPaytmConnectorServer.paytmInvocationCount` and `calls` count every request the endpoint receives. The test also checks `calls` where relevant.
- **Assumed:** agent processes are external HTTP clients. The repo does not establish otherwise.
- **Time:** expiry cases use fake `Date`, not wall-clock waiting.
- **Node version:** tests ran on Node 22.22.0; the package declares `>=24`. Results were produced under Node 22.
- Test 2 (the content-hash cases) and Test 4 stub the governance approval verifier (`{ verify: async () => undefined }`) to isolate the content-hash checks. Test 2's governance cases use the real `createPolicyExecutionVerifier` wiring.

---

## 6. Recommended next steps (by severity)

1. **Bind the decision outcome to the proof (Critical, B17).** Put the approved decision (or a runtime-issued, single-use release token) into the signed authorization, and have `ExecutionGateway.verify` require it. Keep the signing path inside the gate so no other code can request an authorization for a denied decision. Re-run Test 2's "denied decision" case; it should go to PASS.
2. **Stop trusting caller-supplied verification flags (Critical, B5, B6).** `ExecutionControlService.execute` should re-verify the authorization signature and `businessTransactionHash` itself, not rely on `verifiedTransaction` booleans. Consider keeping the gateway attestation key out of any process that can call `ExecutionControl` directly. Re-run the in-process case; it should go to PASS.
3. **Make dev and test relaxations impossible under real configuration (High, B1 to B3, B8, B9).** Refuse to start with `NODE_ENV` in `{test, development}` when `PARMANA_KEY_DIR`, `DATABASE_URL` or a production policy directory is configured. Require policy-hash and governance checks whenever a signing key is loaded, not only in production `NODE_ENV`.
4. **Anchor the audit chain head (High, Test 5).** Publish a signed chain head (last `chain_position` and `chain_hash`) at each write or on a schedule to an append-only location outside the database. Make the verifier check the head, so tail truncation is detected.
5. **Refuse in-place policy overwrites (High, B16, Test 4).** `FilePolicyRepository.save` should refuse an existing `(name, version)`. Governance should only create new versions. Run `verifyPolicyGovernanceIntegrityAtStartup` in CI against a fixture and add it to the audit.
6. **Add per-authorization revocation (Medium).** Authorizations are valid until expiry (120 s observed). A short denylist keyed by `authorizationId` or `nonce`, checked at release, would close the gap between revoking a key and the expiry of every authorization it signed.
7. **Make the offline verifier hermetic (Medium).** Move the verification code into a package that does not import `@parmana/shared` config, so no `.env` is read. Add a separate offline check for the authorization envelope itself.
8. **Close the signal-verifier window (Medium, B11).** Refuse to serve execution until `LateBoundSignalStateVerifier.bind()` has been called, instead of returning `[]`.
9. **Refuse risky flags in production (Medium, B13, B14).** Treat `PARMANA_AUTH_DISABLED=true` and `PARMANA_SANDBOX=true` as startup errors when `NODE_ENV=production`, instead of a warning for the former.
10. **Remove or restrict `legacyInsecure` (Low, B7)** and add end-to-end tests for HubSpot, GitHub, Slack and external connectors using the same harness, with each connector's endpoint counted.

---

## Files

- `proof-audit/REPORT.md` (this file)
- `proof-audit/tests/helpers.ts`, `test1-independent-verification.test.ts`, `test2-execution-requires-proof.test.ts`, `test3-binding.test.ts`, `test4-historical-policy.test.ts`, `test5-audit-tamper.test.ts`
- `proof-audit/verify/verify-offline.mjs`, `proof-audit/verify/deny-network.mjs`
- `proof-audit/artifacts/test1/` (exported proof, public keys, policy version, tampered copies; no private material)
- `proof-audit/results/test{1..5}.json` (per-case verdicts), `proof-audit/results/vitest-run.log`
