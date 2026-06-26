# Parmana Trust Core

**Execution Trust Infrastructure**

Parmana ensures there is no gap between what humans decide and what AI systems do.

Traditional systems can prove who approved a decision and when it was approved. They rarely prove that execution actually matched what was authorized.

Parmana establishes a verifiable trust chain between authority, intent, and execution by producing immutable Execution Trust Records that support replay, audit, verification, and independently verifiable execution receipts.

---

# Core Principle

```text
Authority
      │
      ▼
Business Transaction
      │
      ▼
Policy Evaluation
      │
      ▼
Decision
      │
      ▼
Override (Optional)
      │
      ▼
Execution
      │
      ▼
Receipt
      │
      ▼
Verification
      │
      ▼
Execution Trust Record
```

---

# What Parmana Provides

* Business Transaction processing
* Policy-based decision evaluation
* Human override support
* Execution lifecycle management
* Execution evidence collection
* Cryptographically signed Receipts
* Deterministic replay
* Independent verification
* Complete Execution Trust Records

---

# Repository Structure

```text
docs/
schemas/
openapi/
src/
tests/
```

---

# Documentation

Architecture Specifications

```
docs/specifications/
```

API Documentation

```
docs/api/
```

OpenAPI Specification

```
openapi/openapi.yaml
```

JSON Schemas

```
schemas/
```

---

# REST API

```
POST /v1/transactions

GET /v1/transactions

GET /v1/transactions/{businessTransactionId}

POST /v1/transactions/{businessTransactionId}/executions

GET /v1/transactions/{businessTransactionId}/executions

GET /v1/transactions/{businessTransactionId}/executions/{executionId}

POST /v1/transactions/{businessTransactionId}/override

GET /v1/transactions/{businessTransactionId}/override

POST /v1/transactions/{businessTransactionId}/verify

GET /v1/transactions/{businessTransactionId}/receipt

GET /v1/transactions/{businessTransactionId}/executions/{executionId}/receipt

GET /v1/transactions/{businessTransactionId}/trust-chain

GET /v1/policies

GET /v1/policies/{name}/{version}

GET /v1/health

GET /v1/version
```

---

# Design Principles

* Execution Trust Infrastructure
* Resource-oriented REST API
* Immutable Business Transactions
* Immutable Decisions
* Append-only trust artifacts
* Deterministic replay
* Deterministic verification
* Cryptographically verifiable receipts
* Contract-first API design
* OpenAPI 3.1
* JSON Schema validation

---

# Status

Current Version

```
v1.0.0
```

Status

```
Architecture Locked
API Locked
Schemas Locked
OpenAPI Locked

Ready for Implementation
```

---

# License

Apache License 2.0
