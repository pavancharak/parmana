\# Example 05 — Human in the Loop



\## Overview



This example introduces \*\*Human-in-the-Loop (HITL) governance\*\* within the Parmana Execution Trust Infrastructure.



Not every decision should be executed automatically. In many domains, policy evaluation may reject a request or require explicit human approval before execution can proceed. Parmana records these interventions as immutable trust artifacts, preserving both the original automated decision and the authorized human action.



Rather than replacing automation, Human-in-the-Loop governance ensures that human judgment remains part of the execution trust chain when required.



\---



\# Learning Objectives



After completing this example you will understand:



\* Why human approval is required in certain workflows

\* How Parmana records human overrides

\* The purpose of the `Override` artifact

\* How automated decisions and human approvals coexist

\* How overrides become part of the Execution Trust Record



\---



\# Background



Many AI systems operate in environments where full automation is neither appropriate nor legally permissible.



Examples include:



\* Medical treatment recommendations

\* Financial approvals

\* Industrial safety systems

\* Government services

\* Critical infrastructure

\* Defense operations



In these environments, policies often determine that an operation cannot proceed automatically. Instead, execution must pause until an authorized individual reviews the request.



Parmana supports this model without breaking the integrity of the execution trust chain.



\---



\# Business Problem



Consider a warehouse robot requesting access to a restricted maintenance area.



The request satisfies operational requirements but violates a safety policy because maintenance personnel are present.



The policy rejects execution.



An operations manager determines that emergency repairs are required and authorizes the robot to proceed.



Without structured governance, the organization later cannot answer:



\* Who approved the exception?

\* Why was the policy overridden?

\* Was the override authorized?

\* Was the original rejection preserved?



Parmana records both the policy decision and the human intervention.



\---



\# Parmana Solution



Human approval is represented by an immutable `Override` artifact.



The original policy decision remains unchanged.



The override records:



\* Override identifier

\* Business Transaction identifier

\* Approver identity

\* Reason

\* Optional business justification

\* Approval timestamp



This preserves a complete history of both automated and human decisions.



\---



\# Human-in-the-Loop Architecture



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

Policy Evaluation

&#x20;     │

&#x20;     ▼

Decision

&#x20;     │

&#x20;     ▼

REJECTED

&#x20;     │

&#x20;     ▼

Authorized Override

&#x20;     │

&#x20;     ▼

Execution

&#x20;     │

&#x20;     ▼

Execution Trust Record

```



The override extends the trust chain rather than replacing any existing artifact.



\---



\# Override Artifact



An Override captures the authorized exception.



Typical fields include:



| Field                 | Purpose                     |

| --------------------- | --------------------------- |

| overrideId            | Unique override identifier  |

| businessTransactionId | Associated transaction      |

| approvedBy            | Human approver              |

| reason                | Operational reason          |

| justification         | Optional business rationale |

| approvedAt            | Approval timestamp          |



Overrides are immutable once recorded.



\---



\# Example Walkthrough



The example performs the following sequence:



1\. Create an Authority.

2\. Issue an Authorization.

3\. Define an Intent.

4\. Evaluate the request against policy.

5\. Receive a rejected Decision.

6\. Record a human Override.

7\. Execute the approved action.

8\. Build the Execution Trust Record.



The resulting trust record contains both the automated rejection and the authorized human approval.



\---



\# Example Output



A successful run produces output similar to:



```text

Initial Policy Decision



Decision : REJECTED

Reason   : Restricted zone access denied.



Human Override Approved



Approved By : Operations Manager

Reason      : Emergency maintenance approved.



Execution Trust Record



Overrides   : 1

Executions  : 1



Human-in-the-loop execution completed.

```



\---



\# Why Preserve the Original Decision?



Parmana never modifies historical artifacts.



The original Decision remains:



```text

Decision

Outcome = REJECTED

```



The Override records:



```text

Approved By = Operations Manager

Reason = Emergency maintenance

```



Auditors can therefore distinguish between:



\* the automated policy outcome, and

\* the subsequent human authorization.



This distinction is essential for accountability.



\---



\# Security Considerations



Human overrides should be:



\* explicitly authorized,

\* attributable to an identified approver,

\* timestamped,

\* immutable,

\* independently auditable.



Organizations should ensure that only trusted identities are permitted to issue overrides.



\---



\# Production Deployment



Typical Human-in-the-Loop workflows include:



\* High-value financial approvals

\* Emergency operational exceptions

\* Clinical treatment approval

\* Industrial maintenance

\* Government case reviews

\* AI safety escalation



In each case, Parmana preserves both the automated evaluation and the human decision.



\---



\# Human Approval vs Policy Evaluation



These concepts serve different purposes.



| Policy Evaluation | Human Override         |

| ----------------- | ---------------------- |

| Automated         | Manual                 |

| Deterministic     | Explicit authorization |

| Rule-based        | Context-aware judgment |

| Immediate         | Requires human review  |



Both are represented as immutable trust artifacts.



\---



\# Best Practices



\* Use overrides only when operationally justified.

\* Require authenticated approvers.

\* Record meaningful reasons and justifications.

\* Preserve the original Decision.

\* Include overrides in every Execution Trust Record.



\---



\# Common Pitfalls



Avoid these misconceptions:



\* Overrides do not replace Decisions.

\* Overrides do not modify Policies.

\* Overrides do not delete execution history.

\* Overrides are not shortcuts around governance.



Instead, overrides extend the trust chain while maintaining complete accountability.



\---



\# Real-World Applications



Human-in-the-Loop governance is valuable in:



\* Healthcare

\* Banking

\* Manufacturing

\* Autonomous systems

\* Robotics

\* Government

\* Enterprise AI



Wherever human judgment is required, Parmana records that judgment as part of the execution history.



\---



\# Summary



Human-in-the-Loop governance allows organizations to combine automated policy evaluation with authorized human decision-making.



By preserving both automated and manual actions within the Execution Trust Record, Parmana enables transparent, accountable, and auditable execution without sacrificing operational flexibility.



\---



\# Related Examples



\* Example 04 — Audit Trust Chain

\* Example 06 — Autonomous Vehicle

\* Example 07 — Medical AI



\---



\# Next Step



Continue with:



```text

python/docs/06\_autonomous\_vehicle.md

```



to explore how Parmana governs execution in safety-critical autonomous vehicle workflows while remaining independent of the vehicle's control system.



