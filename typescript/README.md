\# Parmana TypeScript SDK



The official TypeScript SDK for \*\*Parmana\*\*.



Parmana ensures that only Parmana-approved actions are executed.



Parmana is an \*\*Execution Trust Infrastructure\*\* for AI systems.



It ensures that autonomous systems execute \*\*only policy-compliant actions\*\* and produces cryptographically verifiable evidence for every execution.



\---



\# Why Parmana?



Modern AI systems can make decisions autonomously, but organizations need assurance that those decisions comply with business policies before execution.



Parmana provides that assurance.



Using Parmana, organizations can:



\- Execute only policy-compliant actions

\- Produce verifiable execution evidence

\- Build an auditable authorization-to-execution trust chain

\- Independently verify every execution

\- Support governance and regulatory compliance



\---



\# Core Principle



Parmana does not execute business actions.



Parmana authorizes execution.



Only Parmana-approved actions are executed.



\---



\# Architecture



```

Application

&#x20;     │

&#x20;     ▼

Parmana TypeScript SDK

&#x20;     │

&#x20;     ▼

Parmana Runtime

&#x20;     │

&#x20;     ▼

Execution Trust Infrastructure

&#x20;     │

&#x20;     ▼

Execution Trust Record

&#x20;     │

&#x20;     ▼

Independent Verification

```



\---



\# Installation



```bash

npm install @parmana/typescript-sdk

```



\---



\# Quick Start



```typescript

import {

&#x20;   ParmanaClient,

&#x20;   HttpTransport,

} from "@parmana/typescript-sdk";



const client = new ParmanaClient({

&#x20;   endpoint: "https://runtime.example.com",



&#x20;   transport: new HttpTransport({

&#x20;       endpoint: "https://runtime.example.com",

&#x20;   }),

});

```



\---



\# Runtime Health



```typescript

const health =

&#x20;   await client.health();

```



\---



\# Execute



```typescript

const trustRecord =

&#x20;   await client.execute(

&#x20;       transaction,

&#x20;   );

```



The Runtime:



1\. Loads the requested policy.

2\. Evaluates policy deterministically.

3\. Produces a Decision.

4\. Enforces execution approval.

5\. Executes the Runtime Pipeline.

6\. Produces an Execution Trust Record.



\---



\# Verify



```typescript

const verification =

&#x20;   await client.verify(

&#x20;       trustRecord,

&#x20;   );

```



Verification independently validates the Execution Trust Record.



\---



\# Replay



```typescript

const replay =

&#x20;   await client.replay(

&#x20;       trustRecord,

&#x20;   );

```



Replay deterministically re-executes the recorded execution.



\---



\# Validate Policy



```typescript

const result =

&#x20;   await client.validatePolicy(

&#x20;       policy,

&#x20;   );

```



Policy validation checks that a policy is structurally valid before deployment.



\---



\# SDK Architecture



```

ParmanaClient

│

├── HealthApi

├── RuntimeApi

├── VerificationApi

├── ReplayApi

└── PolicyApi

```



The client is intentionally small.



Each API encapsulates a single Parmana capability.



\---



\# Canonical Domain Model



The SDK re-exports the canonical Parmana domain model from `@parmana/shared`.



Core artifacts include:



\- Authority

\- Authorization

\- Intent

\- PolicyReference

\- BusinessTransaction

\- Decision

\- Execution

\- ExecutionEvidence

\- ExecutionTrustRecord

\- Verification

\- Receipt

\- Override



The SDK does not redefine these models.



\---



\# Error Handling



All SDK exceptions inherit from:



```typescript

ParmanaError

```



Common errors include:



\- ConfigurationError

\- ValidationError

\- AuthenticationError

\- AuthorizationError

\- ExecutionRejectedError

\- VerificationError

\- ReplayError

\- NetworkError

\- TimeoutError

\- InternalServerError



\---



\# Configuration



```typescript

const configuration = {

&#x20;   endpoint: "...",

&#x20;   transport: ...,

};

```



The SDK configuration controls communication with the Parmana Runtime.



It does not control policy evaluation or runtime behavior.



\---



\# Examples



See the `examples/` directory.



\- Runtime Health

\- Execute

\- Verify

\- Replay

\- Policy Validation



\---



\# Documentation



The complete SDK documentation is available in:



```

docs/sdk/

```



Including:



\- SDK Architecture

\- SDK Specification

\- Error Model

\- Configuration

\- Versioning

\- Conformance



\---



\# License



Apache License 2.0



\---



\# About Parmana



Parmana is an Execution Trust Infrastructure for autonomous and AI systems.



It establishes a cryptographically verifiable trust chain linking:



Authority → Authorization → Intent → Policy → Decision → Execution → Evidence → Verification



This enables organizations to confidently deploy AI in high-impact workflows while maintaining governance, auditability, and independent verification.

