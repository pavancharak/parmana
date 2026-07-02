# Parmana

**Human Authority for Enterprise AI**

Parmana is execution authorization and verification infrastructure for enterprise AI. It sits between systems that decide AI agents, models, or other automated decision systems — and systems that act, ensuring that every action taken on an organization's behalf is authorized under human-defined policy, cryptographically evidenced, and independently verifiable.

> AI proposes actions. Parmana authorizes them. Execution systems execute them.

Parmana does not perform business operations. It does not move money, place orders, dispatch robots, or call third-party APIs on its own initiative. It authorizes execution and produces the evidence trail that proves that authorization happened correctly. The work itself is carried out by execution systems ERPs, CRMs, payment rails, banking cores, robotics controllers, or internal services — that Parmana governs but does not replace.

---

## Why Parmana?

Enterprises are moving operational decisions to AI at a pace that has outrun their ability to govern them. The open question in most deployments is no longer *"can the model produce a good decision?"* — it is *"can we prove, after the fact, that only authorized actions were taken, under the rules we actually set, with evidence that will hold up to an auditor, a regulator, or a court?"*

Most AI governance tooling today addresses only part of this problem:

- Observability and tracing tools show what happened, but do not stop unauthorized actions before they happen.
- Guardrail and content-moderation tools filter model output, but do not verify authority over the *execution* of a real-world side effect.
- Workflow and orchestration engines coordinate steps, but treat "approved" as a boolean flag, not a cryptographically attestable fact.

None of these produce a durable, independently verifiable record that a specific action was authorized, by a specific policy, in force at a specific time, and that the resulting execution matches what was authorized.

Parmana is built to close that gap directly: deterministic policy enforcement, applied at the point of execution, producing signed evidence that does not depend on trusting Parmana's own runtime after the fact.

---

## What Parmana Does

Parmana's model has three participants and one direction of authority:

```
AI System / Decision System
            │
            │  proposes an intended action
            ▼
        Parmana
            │
            │  authorizes (or denies) based on policy
            ▼
     Execution System
            │
            │  performs the actual business operation
            ▼
        Real-world effect
```

The policy that governs what is authorized is defined by humans, in advance, once — not approved interactively at execution time. Parmana is not a human-in-the-loop approval queue. It is a deterministic enforcement layer: the rules are set ahead of time, and the system runs autonomously within them. When an action falls outside policy, Parmana denies it. When an action is authorized, executed, and evidenced, Parmana produces a signed record of the entire chain — from proposed action to authorization to execution outcome — that any independent party can verify without needing to trust Parmana's runtime at verification time.

---

## Key Capabilities

- **Human Authority** — Policy is authored and owned by humans. Parmana enforces it; it does not originate or revise policy on its own.
- **Policy Enforcement** — Deterministic evaluation of proposed actions against active policy, with no discretionary or model-driven override.
- **Execution Authorization** — A proposed action is only forwarded to an execution system after passing policy evaluation.
- **Execution Verification** — The outcome of an execution is checked against what was authorized, not merely logged.
- **Execution Evidence** — Every authorized execution produces structured evidence describing what was authorized, what was executed, and how they relate.
- **Cryptographic Receipts** — Evidence is packaged into signed receipts that are tamper-evident and independently checkable.
- **Replay** — Past executions can be replayed against recorded evidence to confirm consistency and detect drift or tampering.
- **Trust Records** — A durable, append-oriented record links authority, authorization, execution, and verification into a single traceable chain.
- **Independent Verification** — Verification does not require access to Parmana's live runtime; a receipt and its supporting evidence should be checkable by a third party using published verification logic.

---

## Architecture

### System-level view

```
┌─────────────────────┐
│   AI / Decision      │
│      System          │
└──────────┬───────────┘
           │  proposed action (Intent)
           ▼
┌───────────────────────────────────────────┐
│                 Parmana                    │
│                                             │
│  ┌───────────┐   ┌────────────┐            │
│  │  Authority │──▶│ Policy      │           │
│  │ Validation │   │ Evaluation  │           │
│  └───────────┘   └──────┬─────┘            │
│                          │                  │
│                          ▼                  │
│                 ┌──────────────────┐        │
│                 │ Execution         │        │
│                 │ Authorization     │        │
│                 └────────┬──────────┘        │
│                          │                  │
└──────────────────────────┼──────────────────┘
                           ▼
                ┌─────────────────────┐
                │  Execution System    │
                │ (ERP / CRM / Payment │
                │  / Robotics / API)   │
                └──────────┬───────────┘
                           │  execution result
                           ▼
┌───────────────────────────────────────────┐
│                 Parmana                    │
│                                             │
│  ┌────────────┐   ┌───────────┐            │
│  │ Execution   │──▶│Verification│           │
│  │ Evidence    │   └─────┬─────┘            │
│  └────────────┘         │                  │
│                          ▼                  │
│                 ┌──────────────────┐        │
│                 │ Receipt           │        │
│                 │ Generation        │        │
│                 └────────┬──────────┘        │
│                          ▼                  │
│                 ┌──────────────────┐        │
│                 │ Execution Trust   │        │
│                 │ Record            │        │
│                 └──────────────────┘        │
└─────────────────────────────────────────────┘
```

### Runtime placement

```
   Decision Layer            Governance Layer            Execution Layer
 ┌────────────────┐        ┌──────────────────┐        ┌──────────────────┐
 │  LLM / Agent /   │  ──▶  │      Parmana       │  ──▶  │  ERP / CRM /      │
 │  Rules Engine /  │       │  Runtime + Policy  │       │  Payments / Robots │
 │  Human Operator  │       │  + Crypto + Replay │       │  / Internal APIs   │
 └────────────────┘        └──────────────────┘        └──────────────────┘
```

Parmana is deliberately positioned as a layer *downstream* of reasoning and *upstream* of execution. It has no opinion on how a decision was reached — only on whether the resulting action is authorized, and whether the resulting execution matches what was authorized.

---

## Execution Lifecycle

Every governed action moves through the same sequence:

```
Business Transaction
        │
        ▼
     Authority            (who/what is asserting the right to act)
        │
        ▼
   Authorization           (is this actor permitted to propose this class of action)
        │
        ▼
       Intent              (the specific proposed action)
        │
        ▼
 Policy Evaluation         (deterministic check against active policy)
        │
        ▼
Execution Authorization    (pass/deny decision, signed)
        │
        ▼
   Execution System        (the action is actually performed, externally)
        │
        ▼
 Execution Evidence        (structured record of what happened)
        │
        ▼
    Verification           (execution outcome checked against authorization)
        │
        ▼
      Receipt              (signed, independently verifiable artifact)
        │
        ▼
       Replay              (evidence can be re-derived and checked later)
        │
        ▼
Execution Trust Record     (durable link across the entire chain)
```

Each stage produces an artifact that the next stage consumes; nothing is inferred implicitly, and nothing later in the chain can silently override a decision made earlier in it.

---

## Core Concepts

| Concept | Definition |
|---|---|
| **Business Transaction** | The real-world operation that a decision system wants performed (e.g., "issue a refund," "move a robotic arm," "approve a claim"). |
| **Authority** | The identity and standing of the actor proposing the transaction — what it is, and what class of action it is entitled to propose. |
| **Authorization** | The determination that an actor's Authority permits it to propose a given Intent. |
| **Intent** | The specific, structured description of the proposed action, independent of how it was decided upon. |
| **Policy Reference** | The specific version of policy that was active and applied at evaluation time. |
| **Decision** | The outcome of Policy Evaluation against an Intent — authorized or denied, and why. |
| **Execution** | The actual performance of the authorized action by an external Execution System. |
| **Execution Evidence** | Structured data describing what was executed and how it relates to what was authorized. |
| **Verification** | The check that Execution Evidence is consistent with the Decision that authorized it. |
| **Receipt** | A signed artifact combining Decision, Execution Evidence, and Verification into one independently checkable record. |
| **Execution Trust Record** | The durable, linked chain of Authority → Authorization → Decision → Execution → Verification → Receipt for a given transaction. |
| **Execution System** | The external system that performs the actual business operation once authorized. |

---

## Features

| Category | Feature | Description |
|---|---|---|
| Governance | Policy-as-code enforcement | Policies are defined once by humans and evaluated deterministically at runtime. |
| Governance | Fail-closed evaluation | Actions without a clear authorization are denied by default, not passed through. |
| Cryptography | Signed decisions | Every authorization decision is cryptographically signed. |
| Cryptography | Signed receipts | Execution receipts combine decision, evidence, and verification into one signed artifact. |
| Cryptography | Independent verification | Receipts are checkable by third parties without querying Parmana's live runtime. |
| Evidence | Structured execution evidence | Execution outcomes are captured in a consistent, structured schema. |
| Evidence | Replay | Past evidence can be re-evaluated to confirm it is internally consistent and untampered. |
| Audit | Trust records | Every governed transaction has a durable, linkable audit trail. |
| Audit | Provenance tracking | Signals feeding a decision can be traced back to their source. |
| Integration | Pluggable execution systems | Execution systems are integrated via a defined interface, not hard-coded. |
| Integration | SDK-based access | Client libraries provide a typed interface to Parmana's API. |

---

## Package Overview

Parmana is developed as an npm-workspaces monorepo under the `@parmanasystems/*` scope, targeting Node.js ≥ 22. Core packages:

| Package | Responsibility |
|---|---|
| `@parmanasystems/shared` | Shared types, schemas, and constants used across the ecosystem. |
| `@parmanasystems/runtime` | The core execution-authorization runtime: request handling, orchestration of policy evaluation and evidence generation. |
| `@parmanasystems/policy` | Policy definition, loading, and deterministic evaluation logic. |
| `@parmanasystems/crypto` | Signing, hashing, and verification primitives used for receipts and trust records. |
| `@parmanasystems/storage` | Persistence for trust records, receipts, and evidence. |
| `@parmanasystems/replay` | Replay of recorded evidence for consistency and tamper checking. |
| `@parmanasystems/verification` | Verification logic for checking execution outcomes against authorizations. |
| `@parmanasystems/api` | The REST API surface exposed to clients and execution systems. |

The monorepo includes additional supporting packages beyond this core set (for example, provenance tracking for decision-input signals). Package boundaries and public APIs are still evolving; consult `PACKAGES.md` in the repository for the current authoritative list before depending on a specific package's interface.

---

## Installation

```bash
npm install @parmanasystems/api @parmanasystems/shared
```

Individual packages can be installed independently depending on whether you are building a client integration, an execution system adapter, or working directly with the runtime.

---

## Quick Start

### TypeScript

```typescript
import { ParmanaClient } from "@parmanasystems/api";

const client = new ParmanaClient({
  baseUrl: "https://your-parmana-instance.example.com",
  apiKey: process.env.PARMANA_API_KEY,
});

// Propose an action for authorization
const decision = await client.authorize({
  actor: "billing-agent-01",
  intent: {
    type: "issue_refund",
    amount: 4200,
    currency: "USD",
    orderId: "ORD-99213",
  },
});

if (decision.authorized) {
  // Hand off to your own execution system
  const result = await yourExecutionSystem.performRefund(decision.intent);

  // Report the outcome back to Parmana for evidence and verification
  await client.reportExecution({
    decisionId: decision.id,
    outcome: result,
  });
}
```

### Python

```python
# A Python client is planned but not yet published.
# Track availability in ROADMAP.md.
```

---

## SDKs

A TypeScript client (`ParmanaClient`, part of `@parmanasystems/api`) is the currently supported way to integrate with Parmana. It provides typed access to authorization, execution reporting, verification, and replay endpoints.

A Python SDK is planned to provide equivalent functionality for teams building execution systems or agent integrations in Python, but has not shipped yet. See **Roadmap** below.

---

## Execution Systems

Execution systems are the components that actually carry out authorized actions. Parmana defines an interface that any execution system implements; it does not assume a specific transport or protocol.

```
        ┌─────────────────────┐
        │  ExecutionSystem      │   ← interface
        │  (interface)          │
        └──────────┬───────────┘
                    │
      ┌─────────────┼──────────────┐
      ▼             ▼              ▼
┌───────────┐ ┌───────────────┐ ┌─────────────────┐
│ Default    │ │ HTTP          │ │ Custom            │
│ Execution  │ │ Execution     │ │ Execution System   │
│ System     │ │ System        │ │ (your integration) │
│ (in-process)│ │ (REST calls) │ │                    │
└───────────┘ └───────────────┘ └─────────────────┘
```

- **DefaultExecutionSystem** — An in-process reference implementation, primarily useful for testing and local development.
- **HttpExecutionSystem** — Dispatches authorized actions to an external service over HTTP.
- **Custom implementations** — Any system implementing the execution system interface (ERP connectors, robotics controllers, payment processors, internal microservices) can be plugged in.

---

## Security

Parmana's security model is built on cryptographic attestation of the authorization-to-execution chain, not on trust in any single runtime instance:

- **Hashing** — SHA-256 is used for content-addressing evidence and computing manifest hashes referenced across the authorization and verification chain.
- **Signing** — Decisions and receipts are signed using Ed25519. Post-quantum signature support (e.g., ML-DSA / Dilithium3) is under evaluation for a future release and is not yet implemented.
- **Tamper-evident trust records** — Trust records are structured so that any modification to a linked artifact (decision, evidence, receipt) is detectable.
- **Independent verification** — Verification logic is intended to be usable by a third party against a receipt and its evidence, without needing live access to the issuing Parmana instance.
- **Replay** — Historical evidence can be replayed and re-checked to confirm it has not been altered since issuance.

**Reporting a vulnerability:** Please do not open a public issue for security-sensitive findings. See `SECURITY.md` for the disclosure process.

---

## API Overview

The REST API is organized around the execution lifecycle:

| Endpoint (indicative) | Purpose |
|---|---|
| `POST /v1/authorize` | Submit an Intent for policy evaluation and receive a Decision. |
| `POST /v1/executions/{decisionId}/report` | Report the outcome of an authorized execution. |
| `GET /v1/receipts/{receiptId}` | Retrieve a signed receipt for a completed execution. |
| `POST /v1/verify` | Independently verify a receipt against its evidence. |
| `POST /v1/replay/{trustRecordId}` | Replay a trust record's evidence chain. |
| `GET /v1/trust-records/{id}` | Retrieve a full Execution Trust Record. |

Exact request/response shapes, authentication requirements, and error formats are defined in `API.md`. Note that authentication enforcement and error-response shape are areas currently being hardened — see **Known Limitations** below before relying on the documented contract in a production deployment.

---

## Repository Structure

```
parmana/
├── packages/
│   ├── api/                 # REST API surface
│   ├── runtime/              # Core authorization runtime
│   ├── policy/                # Policy definition and evaluation
│   ├── crypto/                # Signing, hashing, verification primitives
│   ├── storage/               # Persistence for evidence and trust records
│   ├── replay/                # Evidence replay logic
│   ├── verification/          # Execution outcome verification
│   ├── shared/                 # Shared types and schemas
│   └── provenance/             # Signal provenance tracking
├── docs/                      # Source for the documentation site
├── examples/                   # Example integrations
├── ARCHITECTURE.md
├── EXECUTION_MODEL.md
├── TRUST_MODEL.md
├── AUDIT.md
├── SECURITY.md
├── RUNTIME.md
├── EXECUTION_SYSTEMS.md
├── SDK.md
├── API.md
├── PACKAGES.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — System architecture and component boundaries
- [`EXECUTION_MODEL.md`](./EXECUTION_MODEL.md) — The authorization-to-execution lifecycle in detail
- [`TRUST_MODEL.md`](./TRUST_MODEL.md) — What is and isn't trusted, and why
- [`AUDIT.md`](./AUDIT.md) — Audit trail structure and guarantees
- [`SECURITY.md`](./SECURITY.md) — Security model and vulnerability disclosure
- [`RUNTIME.md`](./RUNTIME.md) — Runtime internals
- [`EXECUTION_SYSTEMS.md`](./EXECUTION_SYSTEMS.md) — Building execution system integrations
- [`SDK.md`](./SDK.md) — SDK overview
- [`SDK_TYPESCRIPT.md`](./SDK_TYPESCRIPT.md) — TypeScript SDK reference
- [`SDK_PYTHON.md`](./SDK_PYTHON.md) — Python SDK reference (planned)
- [`API.md`](./API.md) — REST API reference
- [`PACKAGES.md`](./PACKAGES.md) — Monorepo package reference
- [`ROADMAP.md`](./ROADMAP.md) — Near-term roadmap
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — Contribution guidelines

---

## Known Limitations / Implementation Status

Parmana's documentation is written to reflect actual runtime behavior, not intended behavior. As of this release, the following gaps are known and being actively addressed:

- **`confirmExecution()` does not yet perform real verification.** It currently returns `verified: true` unconditionally, regardless of the actual execution outcome. Do not rely on its return value as evidence of a verified execution until this is resolved.
- **`verifyAuditChain()` does not yet perform real chain verification.** It currently returns `true` unconditionally. Audit chain integrity checks should not be considered enforced until this is resolved.
- **Manifest hash mismatch between attestation and verifier.** The hash recorded at attestation time and the hash recomputed at verification time currently diverge (`releaseManifestHash` mismatch), which will cause verification to be unreliable for affected artifacts until resolved.
- **API authentication is not yet enforced end-to-end**, despite `BearerAuth` being declared in the OpenAPI specification.
- **Error response shape does not yet match the documented specification** in all cases.

These are tracked as release blockers. The **Key Capabilities**, **Security**, and **API Overview** sections above describe Parmana's intended and target behavior; they should not be read as a claim that independent verification is fully enforced in the current build. Consult `ROADMAP.md` and the project's issue tracker for current status before depending on verification guarantees in a production environment.

---

## Roadmap

Near-term priorities:

- Resolve the `confirmExecution()` and `verifyAuditChain()` stubs to perform genuine cryptographic verification.
- Resolve the attestation/verifier manifest hash mismatch.
- Enforce API authentication end-to-end and align error responses with the OpenAPI specification.
- Ship a Python SDK with feature parity to the TypeScript client.
- Evaluate post-quantum signature support (ML-DSA / Dilithium3) alongside Ed25519.
- Expand execution system reference implementations (additional ERP, CRM, and payment integrations).

See `ROADMAP.md` for the full, maintained roadmap.

---

## Contributing

Contributions are welcome. Please read `CONTRIBUTING.md` for coding standards, the PR process, and how to run the test suite locally before opening a pull request. Issues that report a gap between documented and actual behavior are especially valuable — see **Known Limitations** above for the current list of tracked gaps.

---

## License

Licensed under the Apache License, Version 2.0. See [`LICENSE`](./LICENSE) for the full text.
