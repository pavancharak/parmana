\# Example 10 — Custom Policy



\## Overview



This example demonstrates one of Parmana's most important architectural principles:



\*\*Every Business Transaction explicitly specifies the exact policy that governs execution.\*\*



Unlike many policy engines that discover, search, or automatically select policies at runtime, Parmana requires the policy to be explicitly referenced by the Business Transaction.



This design guarantees deterministic execution, reproducible decisions, and independent verification.



Example 10 concludes the Python SDK guide by introducing the architectural foundation that enables trusted execution across every Parmana deployment.



\---



\# Learning Objectives



After completing this example you will understand:



\* Why explicit policy selection is critical

\* How `PolicyReference` works

\* Why Business Transactions own policy selection

\* How the Runtime loads policies

\* Why deterministic policy evaluation improves governance

\* How policy versioning enables replay and verification



\---



\# Background



Most enterprise policy systems determine which policy to execute at runtime.



Typical approaches include:



\* Policy discovery

\* Rule matching

\* Dynamic selection

\* Policy prioritization

\* Policy inheritance



Although flexible, these approaches introduce uncertainty.



Questions arise such as:



\* Which policy was actually evaluated?

\* Which version was loaded?

\* Would the same transaction evaluate differently tomorrow?

\* Can the decision be reproduced?



Parmana avoids these problems by requiring explicit policy selection.



\---



\# Business Problem



Consider a manufacturing robot.



A production request is submitted.



The organization has:



\* Production Policy v2.1

\* Production Policy v2.2

\* Production Policy v2.3

\* Production Policy v3.0



If the runtime automatically chooses a policy, investigators may later struggle to determine:



\* Which version executed?

\* Why that version was selected?

\* Whether policy changes affected execution?



Deterministic replay becomes difficult.



\---



\# Parmana Solution



Every Business Transaction includes a `PolicyReference`.



Example:



```python

PolicyReference(

&#x20;   policy\_name="manufacturing-production-policy",

&#x20;   policy\_version="2.3.1",

)

```



This reference becomes part of the immutable trust chain.



The Runtime does not search for policies.



Instead, it loads \*\*exactly\*\* the referenced version.



\---



\# Canonical Policy Architecture



```text

Authority

&#x20;     │

&#x20;     ▼

Authorization

&#x20;     │

&#x20;     ▼

Intent

&#x20;     │

&#x20;     ▼

Business Transaction

&#x20;     │

&#x20;     ▼

Policy Reference

&#x20;     │

&#x20;     ▼

Policy Router

&#x20;     │

&#x20;     ▼

Policy Engine

&#x20;     │

&#x20;     ▼

Decision

&#x20;     │

&#x20;     ▼

Execution

&#x20;     │

&#x20;     ▼

Verification

&#x20;     │

&#x20;     ▼

Receipt

```



Every execution follows this deterministic flow.



\---



\# Policy Reference



A `PolicyReference` identifies a specific policy.



Typical fields include:



| Field          | Purpose                      |

| -------------- | ---------------------------- |

| policy\_name    | Policy identifier            |

| policy\_version | Immutable version identifier |



Because the reference is immutable, every future replay evaluates the same policy version.



\---



\# Business Transaction Ownership



A key Parmana principle is:



> \*\*Business Transactions choose policies.\*\*



The Runtime never chooses policies.



This ensures that governance decisions originate from the requesting business context rather than runtime implementation details.



\---



\# Runtime Responsibilities



The Parmana Runtime performs the following steps:



1\. Receive a Business Transaction.

2\. Read the PolicyReference.

3\. Load the specified policy.

4\. Evaluate runtime signals.

5\. Produce a Decision.

6\. Record Execution.

7\. Produce Verification.

8\. Generate a Receipt.



The Runtime performs \*\*no policy discovery\*\*.



\---



\# Policy Router Responsibilities



The Policy Router has one responsibility:



\* Load the requested policy.



It does \*\*not\*\*:



\* search policies,

\* compare policies,

\* rank policies,

\* discover policies,

\* select policies,

\* infer policies.



Its behavior is deterministic.



\---



\# Why Deterministic Policy Selection Matters



Explicit policy selection provides several benefits.



\### Reproducibility



Future replay evaluates the same policy.



\---



\### Auditability



Auditors know exactly which policy governed execution.



\---



\### Version Control



Multiple policy versions can coexist safely.



\---



\### Independent Verification



Verifiers can retrieve the referenced policy and reproduce the decision.



\---



\### Regulatory Compliance



Organizations can demonstrate precisely which governance rules were applied.



\---



\# Example Scenario



A manufacturing system submits:



> Start production batch BATCH-2026-001.



The Business Transaction references:



```python

PolicyReference(

&#x20;   policy\_name="manufacturing-production-policy",

&#x20;   policy\_version="2.3.1",

)

```



The Runtime loads version \*\*2.3.1\*\*.



Even if version \*\*2.4.0\*\* exists tomorrow, replay continues to use \*\*2.3.1\*\* for this transaction.



\---



\# Expected Output



```text

Parmana Custom Policy



Authority        : Acme Manufacturing

Operation        : START\_PRODUCTION



Policy



Name             : manufacturing-production-policy

Version          : 2.3.1



Runtime



Policy Selection : Explicit

Policy Discovery : Disabled

Decision         : APPROVED



Verification



Status           : VERIFIED



Execution completed with deterministic policy selection.

```



\---



\# Parmana's Role



Parmana \*\*does not\*\*:



\* discover policies

\* search policy repositories

\* infer governance rules

\* select "best" policies

\* evaluate multiple competing policies



Parmana \*\*does\*\*:



\* bind policies to Business Transactions

\* load explicit policy versions

\* evaluate deterministic policies

\* record decisions

\* preserve execution evidence

\* generate receipts

\* support replay

\* enable verification

\* enable auditing



\---



\# Production Deployment



A production deployment typically includes:



\* Policy Registry

\* Policy Repository

\* Policy Router

\* Policy Engine

\* Runtime

\* Verification Service



Each component has a single, well-defined responsibility.



This separation improves maintainability, scalability, and governance.



\---



\# Best Practices



\* Always reference explicit policy versions.

\* Never rely on implicit policy selection.

\* Version policies immutably.

\* Preserve historical policy versions.

\* Include the PolicyReference in every Business Transaction.

\* Verify every execution against the referenced policy.



\---



\# Common Pitfalls



Avoid these misconceptions:



\* The Runtime should not discover policies.

\* The Policy Router should not select policies.

\* Policy evaluation should not depend on repository ordering.

\* Replaying a transaction should never load a newer policy version.



Violating these principles breaks deterministic execution.



\---



\# Real-World Applications



Explicit policy selection benefits:



\* Manufacturing

\* Financial services

\* Healthcare

\* Autonomous vehicles

\* Government systems

\* Enterprise AI platforms

\* Robotics

\* Critical infrastructure

\* Multi-agent systems



Regardless of domain, deterministic policy evaluation remains essential.



\---



\# Architectural Significance



This example illustrates one of Parmana's foundational architectural guarantees:



\*\*The policy is part of the trust chain.\*\*



Because the `PolicyReference` is embedded within the Business Transaction, policy selection itself becomes an immutable, auditable artifact.



This design eliminates ambiguity and enables deterministic replay, independent verification, and long-term governance.



\---



\# Summary



Explicit policy selection is a defining characteristic of Parmana.



By binding a versioned `PolicyReference` directly to every Business Transaction, Parmana ensures that:



\* execution is deterministic,

\* replay is reproducible,

\* verification is independent,

\* audits are unambiguous,

\* governance remains transparent.



Rather than asking the Runtime to determine \*which\* policy should apply, Parmana requires that decision to be made before execution begins and records it as part of the immutable execution trust chain.



\---



\# Related Examples



\* Example 08 — Financial Transaction

\* Example 09 — Multi-Agent



\---



\# Conclusion



You have now completed the Parmana Python SDK examples.



Together, the ten examples demonstrate how Parmana establishes a cryptographically verifiable execution trust chain across a broad range of AI and autonomous system scenarios.



From basic execution to replay, audit, human oversight, autonomous systems, healthcare, finance, multi-agent workflows, and deterministic policy selection, each example builds on the same core architectural principle:



> \*\*AI systems can automate decisions, but organizations need verifiable trust in how those decisions are executed.\*\*



Parmana provides that trust through immutable execution artifacts, explicit governance, deterministic policy evaluation, and independent verification.



