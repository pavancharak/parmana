I would definitely include an `AUDIT.md`, but I'd make it about **execution auditability**, not repository auditing.

## `AUDIT.md`

### Core Claim

> **Every Parmana-authorized execution is independently auditable through cryptographically verifiable execution evidence.**

## Suggested Sections

### 1. Purpose

Explain that Parmana is designed so an independent auditor can determine:

* Who authorized an action
* What policy was applied
* What was executed
* When it was executed
* Whether execution matched the approved intent
* Whether evidence has been tampered with

---

### 2. Audit Principles

* Human Authority
* Policy Enforcement
* Authorization Before Execution
* Cryptographic Integrity
* Replayability
* Independent Verification
* Immutable Execution Evidence (or Tamper-Evident Evidence, depending on your wording)

---

### 3. Audit Lifecycle

```text
Business Transaction
        │
        ▼
Authority
        │
        ▼
Authorization
        │
        ▼
Intent
        │
        ▼
Policy Evaluation
        │
        ▼
Execution
        │
        ▼
Execution Evidence
        │
        ▼
Verification
        │
        ▼
Receipt
        │
        ▼
Execution Trust Record
```

---

### 4. Audit Evidence

Describe every artifact collected.

* Business Transaction
* Authority
* Authorization
* Intent
* Policy Reference
* Decision
* Execution
* Execution Evidence
* Verification
* Receipt
* Trust Record Hash

---

### 5. Independent Verification

Explain that an auditor can verify:

* receipt signature
* trust record hash
* execution evidence
* policy version
* authorization
* verification result

without trusting Parmana itself.

---

### 6. Replay

Explain that every execution can be replayed using the stored evidence.

Purpose:

* Compliance
* Incident investigation
* Internal audit
* External audit
* Regulatory reporting

---

### 7. Cryptographic Integrity

Include:

* SHA-256 trust hashes
* ML-DSA (Dilithium3) signatures
* Receipt verification
* Tamper detection

---

### 8. Audit Guarantees

State guarantees such as:

* Every execution is attributable to an authority.
* Every execution references an approved authorization.
* Every execution references the governing policy.
* Every execution produces execution evidence.
* Every execution can be independently verified.
* Every execution can be replayed.
* Every receipt is cryptographically signed.

---

## Position in the Documentation

I would place it alongside the other core documents:

```text
README.md
ARCHITECTURE.md
EXECUTION_MODEL.md
TRUST_MODEL.md
AUDIT.md
SECURITY.md
POLICY_ENGINE.md
EXECUTION_SYSTEMS.md
RUNTIME.md
REPLAY.md
RECEIPTS.md
API.md
SDK.md
PACKAGES.md
ROADMAP.md
```

For Parmana specifically, `AUDIT.md` is a first-class document because auditability is one of the platform's core differentiators. It should explain not just that auditing is possible, but **how the execution evidence, verification, replay, and cryptographic receipts combine to produce independently auditable execution trust**.
