\# Example 04 — Audit Trust Chain



\## Overview



This example introduces one of Parmana's most important capabilities: \*\*auditing the complete Execution Trust Chain\*\*.



While replay reconstructs what happened during execution, auditing establishes whether every stage of the execution lifecycle can be independently examined, traced, and validated.



The Execution Trust Record is the canonical audit artifact in Parmana. It aggregates every immutable artifact produced throughout the execution lifecycle into a single authoritative record.



For organizations operating AI systems in regulated or high-assurance environments, the Execution Trust Record provides a verifiable foundation for governance, compliance, forensic investigation, and operational transparency.



\---



\# Learning Objectives



After completing this example you will understand:



\* What an Execution Trust Record represents

\* Why Parmana aggregates execution artifacts

\* How to inspect a complete trust chain

\* How audit differs from replay

\* How audit supports governance and compliance



\---



\# Background



Organizations increasingly rely on AI systems to make or assist with decisions that affect customers, operations, and critical infrastructure.



When those decisions are questioned, organizations must answer questions such as:



\* Who authorized the execution?

\* What was the requested intent?

\* Which policy version was evaluated?

\* What decision was produced?

\* What actually executed?

\* Was the execution independently verified?

\* What evidence exists to support the execution?



Answering these questions requires more than application logs. It requires a structured, immutable record that preserves the complete execution lifecycle.



Parmana provides this capability through the Execution Trust Record.



\---



\# Business Problem



Imagine an AI-powered warehouse system that moves inventory between storage locations.



Several months after an incident, an auditor requests evidence explaining why a pallet was moved into a restricted storage area.



Without a unified execution record, investigators may need to collect information from:



\* Identity systems

\* Authorization databases

\* Workflow engines

\* Policy engines

\* Application logs

\* Monitoring systems

\* Audit databases



This process is time-consuming and often produces incomplete or inconsistent results.



Parmana instead provides a single Execution Trust Record that captures the entire chain of execution.



\---



\# Parmana Solution



The Execution Trust Record is the authoritative representation of a completed Business Transaction.



It combines all immutable artifacts associated with the transaction into one auditable structure.



Typical contents include:



\* Business Transaction

\* Override history

\* Execution history

\* Verification history

\* Receipt history

\* Canonical Trust Record hash

\* Creation timestamp

\* Last update timestamp



Because the record is append-only, new artifacts extend the history without modifying previously recorded evidence.



\---



\# Audit Architecture



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

Policy Evaluation

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

&#x20;     │

&#x20;     ▼

Execution Trust Record

&#x20;     │

&#x20;     ▼

Audit

```



The audit process operates on the completed Execution Trust Record.



\---



\# Execution Trust Record



The Execution Trust Record contains every immutable artifact required to understand and verify execution.



A typical record includes:



| Artifact            | Purpose                          |

| ------------------- | -------------------------------- |

| BusinessTransaction | Canonical execution request      |

| Override            | Human approvals or overrides     |

| Execution           | Runtime execution history        |

| Verification        | Independent verification history |

| Receipt             | Cryptographic execution receipts |

| Trust Record Hash   | Canonical digest of the record   |



Together, these artifacts establish a complete execution history.



\---



\# Example Walkthrough



This example performs the following sequence:



1\. Create an Authority.

2\. Create an Authorization.

3\. Define an Intent.

4\. Reference an explicit Policy.

5\. Produce a Decision.

6\. Record an Execution.

7\. Create a Verification artifact.

8\. Generate a Receipt.

9\. Assemble the Execution Trust Record.

10\. Audit the completed trust chain.



The audit function summarizes the contents of the trust record without modifying it.



\---



\# Audit API



The example demonstrates a simple audit function.



```python

audit(record)

```



Future versions of the Parmana SDK may expose richer audit capabilities, including filtering, querying, integrity validation, and policy compliance reporting.



\---



\# Expected Output



A successful audit produces output similar to:



```text

Parmana Trust Chain Audit



Authority           : Acme Corporation

Authorization       : ...

Intent              : MOVE

Policy              : warehouse-policy v1.0.0



Executions          : 1

Verifications       : 1

Receipts            : 1



Trust Record Hash   : ...



Trust chain audit completed successfully.

```



\---



\# Audit vs Replay



Replay and audit serve complementary purposes.



| Replay                          | Audit                             |

| ------------------------------- | --------------------------------- |

| Reconstructs execution          | Inspects execution history        |

| Focuses on operational sequence | Focuses on governance evidence    |

| Helps explain behavior          | Helps demonstrate accountability  |

| Supports debugging              | Supports compliance and oversight |



Replay answers:



> What happened?



Audit answers:



> Can we demonstrate that execution was properly governed?



\---



\# Security Considerations



Audit operates in a read-only manner.



An audit:



\* does not modify Decisions,

\* does not alter Executions,

\* does not regenerate Receipts,

\* does not change Verification results.



Instead, it examines immutable artifacts and validates that the trust chain is complete and internally consistent.



\---



\# Production Deployment



Execution Trust Record auditing is valuable for:



\* Internal compliance reviews

\* External regulatory audits

\* Security investigations

\* Incident response

\* AI governance reporting

\* Quality assurance

\* Operational oversight



Organizations can archive trust records and perform audits long after execution has completed.



\---



\# Real-World Applications



Execution Trust Record auditing is applicable across many domains:



\* Autonomous vehicles

\* Robotics

\* Healthcare

\* Financial services

\* Manufacturing

\* Government systems

\* Critical infrastructure

\* Enterprise AI platforms



Although the business context changes, the audit process remains the same.



\---



\# Best Practices



\* Preserve every Execution Trust Record.

\* Store records in immutable or append-only storage.

\* Audit records regularly.

\* Verify trust record integrity before reporting.

\* Retain historical records for regulatory and forensic purposes.



\---



\# Common Pitfalls



Avoid the following assumptions:



\* Audit is not replay.

\* Audit does not execute business logic.

\* Audit does not create new evidence.

\* Audit does not change historical artifacts.



Its purpose is to inspect and evaluate existing trust records.



\---



\# Summary



Auditing the Execution Trust Chain provides a comprehensive view of a completed Business Transaction.



By aggregating immutable artifacts into a single canonical record, Parmana enables organizations to demonstrate:



\* authorization,

\* policy compliance,

\* execution history,

\* verification,

\* cryptographic evidence,

\* governance.



This capability is fundamental to building trustworthy AI systems that can withstand regulatory scrutiny and operational investigation.



\---



\# Related Examples



\* Example 02 — Verify Receipt

\* Example 03 — Replay Execution

\* Example 05 — Human in the Loop



\---



\# Next Step



Continue with:



```text

python/docs/05\_human\_in\_the\_loop.md

```



to learn how Parmana records authorized human intervention while preserving the integrity of the execution trust chain.



