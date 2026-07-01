\# Example 03 — Replay Execution



\## Overview



This example introduces one of Parmana's defining capabilities: \*\*deterministic replay\*\*.



Replay allows an Execution Trust Record to be reconstructed and inspected after execution has completed. Rather than relying on logs, screenshots, or operator recollection, Parmana uses immutable execution artifacts to recreate the decision process exactly as it occurred.



Replay is essential for audit, debugging, incident investigation, compliance, and continuous improvement.



\---



\# Learning Objectives



After completing this example you will understand:



\* What deterministic replay is

\* Why replay differs from log analysis

\* How an Execution Trust Record enables replay

\* Which artifacts participate in replay

\* How replay supports governance and verification



\---



\# Background



When an AI system performs an action, organizations often need to answer questions long after the event:



\* Why was this decision made?

\* Which policy approved it?

\* What runtime signals were evaluated?

\* Was the execution consistent with the approved decision?

\* Could the same decision be reproduced today?



Traditional application logs rarely provide complete answers. Logs may be incomplete, modified, distributed across multiple systems, or missing the context required to understand a decision.



Parmana addresses this challenge through deterministic replay.



\---



\# Business Problem



Consider an autonomous warehouse robot that unexpectedly places inventory in the wrong location.



Several days later an engineer is asked to investigate.



Questions include:



\* What Intent was submitted?

\* Which Authorization allowed execution?

\* Which Policy version was evaluated?

\* What runtime signals were observed?

\* Was the Decision approved or rejected?

\* What actually executed?



Without replay, engineers must manually reconstruct events from logs and operational systems.



Parmana provides a single immutable Execution Trust Record from which the complete execution history can be reconstructed.



\---



\# Parmana Solution



Replay reconstructs execution using immutable trust artifacts.



Instead of asking:



> What do the logs say?



Replay asks:



> What does the canonical Execution Trust Record prove?



Because every artifact is immutable and linked through the trust chain, replay always operates on the original execution evidence.



\---



\# Replay Architecture



```text

Business Transaction

&#x20;         │

&#x20;         ▼

Policy Evaluation

&#x20;         │

&#x20;         ▼

Decision

&#x20;         │

&#x20;         ▼

Execution

&#x20;         │

&#x20;         ▼

Execution Evidence

&#x20;         │

&#x20;         ▼

Execution Trust Record

&#x20;         │

&#x20;         ▼

Replay

```



Replay never modifies the trust record.



It reconstructs the execution for inspection.



\---



\# Replay Inputs



Replay operates on an `ExecutionTrustRecord`.



The record contains:



\* BusinessTransaction

\* Override history

\* Execution history

\* Verification history

\* Receipt history

\* Trust Record hash



These immutable artifacts provide sufficient information to reconstruct the execution lifecycle.



\---



\# Example Walkthrough



The example performs the following sequence:



1\. Create an Authority.

2\. Create an Authorization.

3\. Define an Intent.

4\. Reference a Policy.

5\. Produce a Decision.

6\. Record an Execution.

7\. Build an Execution Trust Record.

8\. Replay the recorded execution.



The replay operation prints a summary of the recorded execution.



\---



\# Replay API



The example uses a placeholder replay function.



```python

replay(record)

```



Future versions of the Parmana SDK will expose a dedicated Replay API while preserving the same conceptual workflow.



\---



\# Replay Output



Replay displays information such as:



\* Trust Record identifier

\* Business Transaction identifier

\* Number of executions

\* Execution status

\* Decision outcome

\* Execution timestamps



Example:



```text

Replay Summary



Trust Record : ...

Transaction  : ...

Executions   : 1



Execution ID : ...

Status       : COMPLETED

Decision     : APPROVED



Replay completed successfully.

```



\---



\# Why Replay Matters



Replay provides several advantages over traditional logging.



\### Deterministic



Replay is based on immutable execution artifacts rather than mutable application logs.



\### Explainable



Replay shows the complete execution path rather than isolated log messages.



\### Repeatable



The same Execution Trust Record always produces the same replay result.



\### Auditable



Replay provides regulators and auditors with a transparent reconstruction of execution.



\---



\# Security Considerations



Replay never changes execution history.



Replay:



\* does not modify Decisions,

\* does not modify Executions,

\* does not modify Receipts,

\* does not modify Verifications.



Replay is a read-only operation over immutable artifacts.



\---



\# Production Deployment



Replay is valuable for:



\* incident response,

\* compliance investigations,

\* post-incident reviews,

\* AI debugging,

\* governance reporting,

\* quality assurance,

\* regression testing.



Organizations can replay historical executions without interacting with the original runtime environment.



\---



\# Replay vs Logging



| Traditional Logging    | Parmana Replay                    |

| ---------------------- | --------------------------------- |

| Best-effort records    | Immutable trust artifacts         |

| May be incomplete      | Complete execution chain          |

| Often distributed      | Single canonical record           |

| Difficult to correlate | Explicit relationships            |

| Mutable                | Immutable                         |

| Operational focus      | Governance and verification focus |



\---



\# Relationship to Verification



Replay and verification serve different purposes.



Verification answers:



> Can this execution be trusted?



Replay answers:



> What exactly happened during execution?



Verification establishes confidence.



Replay establishes understanding.



Together they provide a complete governance capability.



\---



\# Real-World Applications



Replay is valuable across many domains, including:



\* Autonomous vehicles

\* Robotics

\* Financial systems

\* Healthcare

\* Industrial automation

\* Government services

\* Enterprise AI platforms



Any system that requires explainability and auditability benefits from deterministic replay.



\---



\# Best Practices



\* Preserve every Execution Trust Record.

\* Replay immutable artifacts only.

\* Perform verification before replay when integrity is in question.

\* Archive trust records for long-term investigations.

\* Treat replay as a diagnostic and governance capability rather than an execution mechanism.



\---



\# Common Pitfalls



Avoid these misconceptions:



\* Replay does not execute business logic again.

\* Replay does not re-evaluate policies.

\* Replay does not generate new Decisions.

\* Replay does not alter execution history.



Replay reconstructs an existing execution; it does not create a new one.



\---



\# Summary



Deterministic replay is one of Parmana's core capabilities.



Rather than depending on operational logs, replay reconstructs execution directly from immutable trust artifacts.



This enables engineers, auditors, regulators, and security teams to understand exactly what happened, why it happened, and how it can be independently verified.



\---



\# Related Examples



\* Example 01 — Basic Execution

\* Example 02 — Verify Receipt

\* Example 04 — Audit Trust Chain



\---



\# Next Step



Continue with:



```text

python/docs/04\_audit\_trust\_chain.md

```



to learn how Parmana inspects and validates the complete execution trust chain across all recorded artifacts.



