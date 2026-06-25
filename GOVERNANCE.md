\# Parmana Governance



\*\*Version:\*\* 0.1.0



\*\*Status:\*\* Active



\---



\# Purpose



This document defines how the Parmana architecture, specifications, and implementations evolve.



The objective of governance is to preserve long-term architectural integrity while allowing controlled evolution.



\---



\# Governance Principles



Parmana is governed by the following principles:



\* Execution Trust first.

\* Architecture before implementation.

\* Deterministic behavior.

\* Immutable execution records.

\* Independent verification.

\* Backward compatibility where practical.

\* Explicit architectural decisions.



\---



\# Governance Hierarchy



The repository follows this order of authority.



```text

Constitution

&#x20;     │

&#x20;     ▼

Specifications (000–017)

&#x20;     │

&#x20;     ▼

Architecture Decision Records

&#x20;     │

&#x20;     ▼

RFCs

&#x20;     │

&#x20;     ▼

Implementation

```



A lower level SHALL NOT contradict a higher level.



\---



\# Roles



\## Maintainers



Maintainers are responsible for:



\* Reviewing architectural changes.

\* Approving ADRs.

\* Maintaining specifications.

\* Protecting long-term consistency.



\---



\## Contributors



Contributors are responsible for:



\* Following specifications.

\* Writing tests.

\* Updating documentation.

\* Proposing RFCs for significant changes.



\---



\# Change Categories



\## Bug Fix



Characteristics:



\* No architectural impact.

\* No specification changes.



Requirements:



\* Tests.

\* Pull request.



\---



\## Feature



Characteristics:



\* New capability.

\* Existing architecture preserved.



Requirements:



\* Documentation update.

\* Tests.



\---



\## Architectural Change



Characteristics:



\* Changes package responsibilities.

\* Changes execution model.

\* Changes platform guarantees.



Requirements:



\* RFC.

\* ADR.

\* Specification update.

\* Maintainer approval.



\---



\## Breaking Change



Characteristics:



\* Changes public behavior.

\* Changes contracts.

\* Changes compatibility.



Requirements:



\* Major version increment.

\* Migration documentation.

\* Updated conformance tests.



\---



\# Architectural Review Checklist



Every architectural proposal should answer:



\* Does it preserve Execution Trust?

\* Does it preserve determinism?

\* Does it preserve immutability?

\* Does it preserve independent verification?

\* Does it preserve package boundaries?

\* Does it preserve replayability?



If any answer is "No," the proposal requires explicit justification.



\---



\# Specification Lifecycle



Specifications progress through these states:



```text

Draft

&#x20;   │

&#x20;   ▼

Review

&#x20;   │

&#x20;   ▼

Accepted

&#x20;   │

&#x20;   ▼

Implemented

&#x20;   │

&#x20;   ▼

Frozen

```



Frozen specifications should only change through a new ADR.



\---



\# ADR Lifecycle



```text

Proposed

&#x20;   │

&#x20;   ▼

Accepted

&#x20;   │

&#x20;   ▼

Implemented

&#x20;   │

&#x20;   ▼

Superseded

```



Superseded ADRs remain part of the permanent project history.



\---



\# RFC Lifecycle



```text

Draft

&#x20;   │

&#x20;   ▼

Discussion

&#x20;   │

&#x20;   ▼

Accepted / Rejected

&#x20;   │

&#x20;   ▼

Implemented

```



RFCs describe proposals.



They do not change the architecture until accepted and reflected in an ADR or specification.



\---



\# Versioning



Parmana follows Semantic Versioning.



\* MAJOR — Breaking architectural or public API changes.

\* MINOR — Backward-compatible features.

\* PATCH — Bug fixes and documentation improvements.



\---



\# Quality Gates



Every merge to the default branch should satisfy:



\* Build passes.

\* Type checking passes.

\* Unit tests pass.

\* Conformance tests pass (when applicable).

\* Documentation updated (when applicable).



\---



\# Long-Term Commitment



Parmana prioritizes long-term architectural stability over short-term implementation convenience.



Execution Trust remains the primary design objective for every decision.



All governance decisions should strengthen that objective.



