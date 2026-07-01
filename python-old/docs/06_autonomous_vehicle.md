\# Example 06 — Autonomous Vehicle



\## Overview



This example demonstrates how Parmana provides \*\*execution trust\*\* for autonomous vehicle systems.



Parmana is \*\*not\*\* an autonomous driving stack. It does not perform perception, localization, planning, or vehicle control.



Instead, Parmana governs \*\*whether an autonomous action is authorized, policy-compliant, executed as intended, and independently verifiable\*\*.



In this example, an autonomous vehicle requests permission to perform a lane change. Parmana records the complete execution trust chain from authorization through execution and verification.



\---



\# Learning Objectives



After completing this example you will understand:



\* How Parmana fits into an autonomous vehicle architecture

\* How driving actions become Business Transactions

\* Why explicit Policy References are critical

\* How runtime evidence is recorded

\* How the complete execution can later be audited and replayed



\---



\# Background



Modern autonomous vehicles consist of multiple subsystems.



Typical components include:



\* Perception

\* Localization

\* Prediction

\* Planning

\* Control

\* Vehicle Actuation



These systems determine \*\*how\*\* the vehicle drives.



Parmana answers a different question:



> Can we prove that the requested autonomous action was authorized, evaluated under the correct policy, executed, and independently verified?



This distinction is fundamental.



\---



\# Business Problem



Consider an autonomous vehicle travelling on a highway.



The planning system determines that changing lanes is the safest maneuver.



Months later, investigators ask:



\* Who authorized autonomous driving?

\* Which driving policy approved the lane change?

\* What sensor signals were evaluated?

\* Was the maneuver executed successfully?

\* Can the event be independently verified?



Without structured governance, answering these questions requires reconstructing data from numerous vehicle subsystems.



Parmana instead preserves a single immutable Execution Trust Record.



\---



\# Parmana Solution



Parmana governs execution rather than vehicle control.



The execution trust chain records:



\* Fleet authority

\* Vehicle authorization

\* Driving intent

\* Policy reference

\* Runtime decision

\* Execution evidence

\* Verification

\* Receipt



Each artifact contributes to a deterministic and auditable record.



\---



\# Autonomous Vehicle Architecture



```text

Fleet Management

&#x20;       │

&#x20;       ▼

Authority

&#x20;       │

&#x20;       ▼

Authorization

&#x20;       │

&#x20;       ▼

Driving Intent

&#x20;       │

&#x20;       ▼

Business Transaction

&#x20;       │

&#x20;       ▼

Policy Reference

&#x20;       │

&#x20;       ▼

Policy Evaluation

&#x20;       │

&#x20;       ▼

Decision

&#x20;       │

&#x20;       ▼

Vehicle Execution

&#x20;       │

&#x20;       ▼

Execution Evidence

&#x20;       │

&#x20;       ▼

Verification

&#x20;       │

&#x20;       ▼

Receipt

&#x20;       │

&#x20;       ▼

Execution Trust Record

```



Parmana governs the decision lifecycle—not the vehicle's control algorithms.



\---



\# Example Scenario



The autonomous vehicle receives the following request:



> Change to the left lane to safely overtake a slower vehicle.



The planning system submits the request as an Intent.



The Business Transaction explicitly references the applicable driving policy.



The runtime evaluates the policy using supplied runtime signals.



\---



\# Runtime Signals



Typical runtime signals include:



\* Left lane availability

\* Vehicle speed

\* Rear vehicle distance

\* Weather conditions

\* Lane markings visibility

\* Road conditions



These signals are captured as immutable evidence supporting later replay and verification.



\---



\# Policy Evaluation



The policy determines whether execution is permitted.



Possible outcomes include:



\* APPROVED

\* REJECTED



In this example the maneuver satisfies the driving policy and is approved.



\---



\# Execution



Execution represents what actually occurred.



Recorded information includes:



\* Execution status

\* Execution mode

\* Start time

\* Completion time

\* Execution evidence



Execution evidence may include:



\* Actual vehicle speed

\* Lane change duration

\* Minimum vehicle clearance

\* Completion status



Parmana intentionally does not prescribe the structure of execution evidence, allowing it to adapt to different autonomous driving platforms.



\---



\# Verification



After execution, Parmana verifies the Execution Trust Record.



Verification confirms:



\* Artifact integrity

\* Trust Record hash

\* Internal consistency

\* Successful execution



Verification produces an immutable Verification artifact.



\---



\# Receipt



A Receipt provides cryptographic proof that the execution occurred.



Typical receipt contents include:



\* Receipt identifier

\* Execution identifier

\* Trust Record hash

\* Receipt hash

\* Digital signature

\* Signature algorithm

\* Timestamp



Receipts support independent verification by auditors, regulators, insurers, or other trusted parties.



\---



\# Expected Output



A successful execution produces output similar to:



```text

Parmana Autonomous Vehicle



Vehicle          : vehicle-AV-001

Operation        : CHANGE\_LANE

Target           : Left Lane



Decision



Outcome          : APPROVED

Reason           : Lane change satisfies driving policy.



Execution



Status           : COMPLETED



Verification



Status           : VERIFIED



Lane change completed with a fully verifiable execution trust chain.

```



\---



\# Parmana's Role



Parmana \*\*does not\*\*:



\* Detect obstacles

\* Perform perception

\* Plan trajectories

\* Control steering

\* Control braking

\* Control acceleration



Parmana \*\*does\*\*:



\* Record authority

\* Record authorization

\* Record intent

\* Evaluate policy

\* Produce immutable decisions

\* Record execution

\* Generate receipts

\* Enable verification

\* Support replay

\* Enable audit



\---



\# Production Deployment



A production autonomous vehicle deployment may integrate Parmana with:



\* Fleet Management Systems

\* Identity and Access Management

\* Policy Management

\* Vehicle Telemetry

\* Event Recorders

\* Safety Monitoring Systems

\* Regulatory Reporting Platforms



Parmana becomes the governance layer connecting these systems through a verifiable execution trust chain.



\---



\# Best Practices



\* Reference explicit policy versions in every Business Transaction.

\* Capture all policy-relevant runtime signals.

\* Preserve execution evidence without modification.

\* Verify every completed execution.

\* Archive Execution Trust Records for post-incident analysis.



\---



\# Common Pitfalls



Avoid the following misconceptions:



\* Parmana is not an autonomous driving framework.

\* Parmana does not replace perception or planning.

\* Parmana does not determine how a vehicle drives.

\* Parmana governs the authorization and execution of driving actions.



Maintaining this separation of responsibilities simplifies integration and improves auditability.



\---



\# Real-World Applications



This execution trust model extends beyond lane changes to:



\* Highway merging

\* Emergency braking authorization

\* Intersection crossing

\* Parking maneuvers

\* Fleet coordination

\* Remote operator intervention

\* Autonomous delivery vehicles

\* Industrial mobile robots



The governance model remains consistent across different autonomous systems.



\---



\# Summary



Autonomous systems require more than intelligent decision-making—they require trustworthy execution.



Parmana provides a deterministic, auditable execution trust chain that records who authorized an action, which policy evaluated it, what decision was produced, how execution occurred, and how the resulting evidence can be independently verified.



This enables organizations to demonstrate accountability without becoming part of the vehicle control system itself.



\---



\# Related Examples



\* Example 05 — Human in the Loop

\* Example 07 — Medical AI

\* Example 09 — Multi-Agent



\---



\# Next Step



Continue with:



```text

python/docs/07\_medical\_ai.md

```



to explore how Parmana governs AI-assisted clinical workflows while preserving physician oversight and a complete execution trust chain.



