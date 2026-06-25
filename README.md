\# Parmana



> \*\*Execution Trust Infrastructure\*\*



Parmana establishes a verifiable trust chain between \*\*authority\*\*, \*\*intent\*\*, and \*\*execution\*\*, ensuring there is no gap between what humans decide and what AI systems do.



\---



\# Why Parmana?



Traditional systems answer questions such as:



\* Who approved this?

\* When was it approved?



Modern AI systems introduce a more important question:



> \*\*Did execution actually match what was authorized?\*\*



Parmana answers that question.



It records immutable execution facts, produces verifiable evidence, and enables independent verification of every execution.



\---



\# Core Principle



```

Authority

&#x20;     │

&#x20;     ▼

Intent

&#x20;     │

&#x20;     ▼

Authorization

&#x20;     │

&#x20;     ▼

Execution

&#x20;     │

&#x20;     ▼

Evidence

&#x20;     │

&#x20;     ▼

Verification

&#x20;     │

&#x20;     ▼

Execution Trust

```



Execution Trust is established when an independent verifier can demonstrate that execution faithfully reflects authorized intent.



\---



\# Architecture



The platform consists of independent packages.



```

packages/



core/

runtime/

verification/

crypto/

storage/

sdk/

api/

cli/

```



Each package has a single responsibility.



\---



\# Design Principles



Parmana is built on seven architectural principles:



1\. ExecutionTransaction is the aggregate root.

2\. The Core domain model is immutable.

3\. Verification is independent of Runtime.

4\. Runtime is implemented as a deterministic pipeline.

5\. Evidence is append-only.

6\. Cryptography is algorithm-agnostic.

7\. Execution is deterministic.



These principles are documented in the Architecture Decision Records.



\---



\# Documentation



```

docs/



000–017      Specifications



adr/         Architecture Decision Records



rfcs/        Future proposals



guides/      Developer guides

```



\---



\# Repository Layout



```

parmana/



docs/

packages/

examples/

tests/

scripts/

.github/



README.md

ROADMAP.md

CONTRIBUTING.md

LICENSE

```



\---



\# Development



Install dependencies:



```bash

npm install

```



Build:



```bash

npm run build

```



Run tests:



```bash

npm test

```



Type checking:



```bash

npm run typecheck

```



\---



\# Roadmap



Current implementation phases:



\* Core

\* Runtime

\* Verification

\* Cryptography

\* Storage

\* SDK

\* API

\* CLI



See `ROADMAP.md` for details.



\---



\# Contributing



Please read:



\* `CONTRIBUTING.md`

\* `docs/adr/`

\* `docs/000-CONSTITUTION.md`



Architectural changes should begin with an RFC or ADR before implementation.



\---



\# License



See `LICENSE`.



\---



\# Vision



Parmana is an Execution Trust Infrastructure.



Its purpose is not merely to execute software, but to make execution independently verifiable through immutable evidence, deterministic behavior, and cryptographic integrity.



Execution Trust is the foundation upon which trustworthy autonomous systems can be built.



