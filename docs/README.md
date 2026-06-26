\# Parmana API v1 — Final Architecture Documentation



\*\*Version:\*\* 1.0.0



\*\*Status:\*\* Locked



\---



\# Purpose



This document defines the complete API architecture for Parmana v1.



Parmana is an \*\*Execution Trust Infrastructure\*\* that ensures there is no gap between what humans decide and what AI systems do.



The API enables applications to submit Business Transactions, evaluate Policies, execute approved decisions, capture execution evidence, generate cryptographically verifiable receipts, and independently verify the complete Execution Trust Record.



\---



\# Repository Structure



```text

docs/

├── specifications/

│   ├── 01-business-transaction-model-v1.md

│   ├── 02-metadata-model-v1.md

│   ├── 03-policy-resolution-model-v1.md

│   ├── 04-decision-model-v1.md

│   ├── 05-override-model-v1.md

│   ├── 06-execution-model-v1.md

│   ├── 07-execution-lifecycle-model-v1.md

│   ├── 08-verification-model-v1.md

│   ├── 09-receipt-model-v1.md

│   ├── 10-execution-trust-record-model-v1.md

│   └── 11-authentication-and-authorization-model-v1.md

│

├── api/

│   ├── 01-api-overview.md

│   ├── 02-request-response-model.md

│   ├── 03-error-model.md

│   └── 04-openapi-v1.md

│

schemas/

├── common/

│   ├── metadata.schema.json

│   ├── policy.schema.json

│   ├── signals.schema.json

│   ├── decision.schema.json

│   ├── execution.schema.json

│   ├── override.schema.json

│   ├── receipt.schema.json

│   ├── verification.schema.json

│   ├── execution-trust-record.schema.json

│   ├── error.schema.json

│   └── pagination.schema.json

│

├── requests/

│   ├── transaction-create-request.schema.json

│   ├── execution-create-request.schema.json

│   └── override-create-request.schema.json

│

├── responses/

│   ├── transaction-response.schema.json

│   ├── execution-response.schema.json

│   ├── override-response.schema.json

│   ├── verification-response.schema.json

│   ├── receipt-response.schema.json

│   ├── trust-chain-response.schema.json

│   ├── policy-response.schema.json

│   ├── health-response.schema.json

│   └── version-response.schema.json

│

openapi/

└── openapi.yaml

```



\---



\# Resource Model



```

Business Transaction

│

├── Execution(s)

│

├── Override

│

├── Verification(s)

│

├── Receipt(s)

│

└── Trust Chain

```



The Business Transaction is the aggregate root for every trust artifact.



\---



\# REST API



\## System



```

GET /v1/health



GET /v1/version

```



\---



\## Business Transactions



```

POST /v1/transactions



GET /v1/transactions



GET /v1/transactions/{businessTransactionId}

```



\---



\## Executions



```

POST /v1/transactions/{businessTransactionId}/executions



GET /v1/transactions/{businessTransactionId}/executions



GET /v1/transactions/{businessTransactionId}/executions/{executionId}

```



\---



\## Overrides



```

POST /v1/transactions/{businessTransactionId}/override



GET /v1/transactions/{businessTransactionId}/override

```



\---



\## Verification



```

POST /v1/transactions/{businessTransactionId}/verify

```



\---



\## Receipts



```

GET /v1/transactions/{businessTransactionId}/receipt



GET /v1/transactions/{businessTransactionId}/executions/{executionId}/receipt

```



\---



\## Trust Chain



```

GET /v1/transactions/{businessTransactionId}/trust-chain

```



\---



\## Policies



```

GET /v1/policies



GET /v1/policies/{name}/{version}

```



\---



\# Core Principles



\## Business Transaction



The Business Transaction is immutable and uniquely identified by `businessTransactionId`.



\---



\## Policy Resolution



Clients explicitly provide:



\* Policy Name

\* Policy Version

\* Schema Version



Parmana never automatically selects a Policy.



\---



\## Decision



A Decision is immutable.



Possible outcomes:



\* APPROVED

\* REJECTED



\---



\## Override



Overrides:



\* are optional

\* occur before terminal execution

\* are immutable

\* do not modify the original Decision



\---



\## Execution



Execution records what actually happened.



Execution lifecycle:



\* PROCESSING

\* COMPLETED

\* FAILED



\---



\## Verification



Verification:



\* is deterministic

\* validates the complete Execution Trust Record

\* requires no request body

\* creates a Verification artifact



\---



\## Receipt



Receipts:



\* are generated automatically

\* are immutable

\* are cryptographically signed

\* represent the Execution Trust Record



\---



\## Execution Trust Record



The Execution Trust Record is the canonical source of truth.



It contains:



\* Metadata

\* Policy

\* Signals

\* Decision

\* Override History

\* Execution History

\* Verification History

\* Receipt History



\---



\# API Design Principles



\* Resource-oriented REST API

\* Immutable trust artifacts

\* Append-only history

\* Deterministic replay

\* Deterministic verification

\* Cryptographically verifiable receipts

\* Stable machine-readable error codes

\* JSON Schema validation

\* OpenAPI 3.1 contract-first design



\---



\# Architecture Invariants



\* One Business Transaction → One Execution Trust Record

\* Business Transactions are immutable

\* Decisions are immutable

\* Overrides never replace Decisions

\* Executions are append-only

\* Receipts are generated automatically

\* Verification validates the complete Execution Trust Record

\* Replay always uses recorded Policy and Schema versions

\* Trust Chain is a representation of the Execution Trust Record



\---



\# Implementation Order



```

Architecture Specifications

&#x20;       │

&#x20;       ▼

API Specifications

&#x20;       │

&#x20;       ▼

JSON Schemas

&#x20;       │

&#x20;       ▼

OpenAPI 3.1

&#x20;       │

&#x20;       ▼

Controllers

&#x20;       │

&#x20;       ▼

Services

&#x20;       │

&#x20;       ▼

Persistence

&#x20;       │

&#x20;       ▼

SDK Generation

```



\---



\# Status



\*\*Architecture:\*\* Locked



\*\*API Design:\*\* Locked



\*\*JSON Schemas:\*\* Locked



\*\*OpenAPI Contract:\*\* Locked



\*\*Status:\*\* Ready for implementation



\---



\# Canonical Principle



Parmana establishes a verifiable trust chain between authority, intent, and execution.



Every Business Transaction produces a single immutable Execution Trust Record that becomes the authoritative source for replay, audit, verification, and cryptographically verifiable execution receipts.



