\# Example 01 — Basic Execution



\## Overview



This example introduces the fundamental execution flow in Parmana.



It demonstrates how an authorized business intent becomes a verifiable execution through Parmana's Execution Trust Infrastructure.



This is the recommended starting point for all developers using the Parmana Python SDK.



\---



\# Learning Objectives



After completing this example you will understand:



\* The purpose of Authority

\* How Authorization grants permission

\* How Intent represents requested work

\* Why BusinessTransaction is the canonical execution request

\* How Runtime produces an Execution Trust Receipt

\* The relationship between execution and verification



\---



\# Background



Traditional software records only what happened.



Modern AI systems must answer additional questions:



\* Who authorized this action?

\* Which policy approved it?

\* What intent was evaluated?

\* Can the execution be independently verified?

\* Can the decision be replayed later?



Parmana provides a deterministic execution trust chain that answers these questions.



\---



\# Business Problem



Consider an AI system controlling a warehouse robot.



The robot receives the instruction:



> Move pallet P-102 to Loading Bay 3.



Without execution governance an auditor cannot determine:



\* Who approved the action

\* Whether the robot was authorized

\* Which policy evaluated the request

\* Whether the execution matched the approved intent



Parmana records each stage as an immutable trust artifact.



\---



\# Parmana Solution



Parmana establishes a cryptographically verifiable execution trust chain.



Every execution begins with authority and ends with verifiable evidence.



The runtime never guesses intent.



The runtime never invents policy.



The runtime executes only an explicitly authorized BusinessTransaction.



\---



\# Execution Trust Chain



```text

Authority

&#x20;     ↓

Authorization

&#x20;     ↓

Intent

&#x20;     ↓

Business Transaction

&#x20;     ↓

Policy Reference

&#x20;     ↓

Policy Evaluation

&#x20;     ↓

Decision

&#x20;     ↓

Execution

&#x20;     ↓

Receipt

```



Each artifact references the previous artifact, creating a continuous chain of trust.



\---



\# Domain Objects



This example introduces the core Parmana models.



\## Authority



Represents the organization responsible for issuing authorizations.



Example:



```python

Authority(

&#x20;   authority\_name="Acme Corporation"

)

```



\---



\## Authorization



Defines what actions are permitted.



Example:



```python

Authorization(

&#x20;   action="MOVE"

)

```



\---



\## Intent



Represents what the system has been asked to do.



Example:



```python

Intent(

&#x20;   operation="MOVE",

&#x20;   target="warehouse-zone-a"

)

```



\---



\## PolicyReference



Identifies the exact policy version used during evaluation.



Example:



```python

PolicyReference(

&#x20;   policy\_name="warehouse-safety",

&#x20;   policy\_version="1.0.0"

)

```



Parmana always evaluates the explicitly referenced policy.



\---



\## BusinessTransaction



BusinessTransaction is the canonical execution request.



It binds together:



\* Authority

\* Authorization

\* Intent

\* PolicyReference



Everything executed by Parmana begins with a BusinessTransaction.



\---



\# Execution Flow



The example performs the following sequence:



1\. Create an Authority.

2\. Issue an Authorization.

3\. Define an Intent.

4\. Reference a Policy.

5\. Construct a BusinessTransaction.

6\. Execute using `ParmanaClient`.

7\. Receive a Receipt.



\---



\# Example Code Walkthrough



```python

client = ParmanaClient()



receipt = client.execute(transaction)

```



The SDK sends the BusinessTransaction to the Parmana Runtime.



The runtime evaluates the referenced policy.



If execution succeeds, Parmana returns an immutable Receipt.



\---



\# Receipt



A Receipt is cryptographic evidence that an execution occurred.



It contains:



\* Receipt ID

\* Execution ID

\* Trust Record Hash

\* Signature

\* Signing Algorithm

\* Timestamp



Receipts enable independent verification.



\---



\# Expected Output



A successful execution produces output similar to:



```text

Parmana Basic Execution



Transaction : ...

Authority   : Acme Corporation

Intent      : MOVE

Policy      : warehouse-safety



Execution Receipt



Receipt ID  : ...

Algorithm   : Ed25519



Execution completed successfully.

```



\---



\# Security Considerations



This example demonstrates several Parmana guarantees.



\* Explicit authorization

\* Explicit policy selection

\* Immutable execution artifacts

\* Cryptographic receipts

\* Independent verification support



\---



\# Production Deployment



In production:



\* Authority represents an enterprise or organization.

\* Authorization originates from identity and access management.

\* Intent is produced by an application or AI agent.

\* Policies are versioned and managed centrally.

\* Receipts are stored for audit and compliance.



\---



\# Real-World Applications



The same execution model applies to:



\* Warehouse robotics

\* Autonomous vehicles

\* Industrial automation

\* Healthcare

\* Banking

\* AI agents

\* Government systems



Only the Intent and Policy change.



The execution trust architecture remains identical.



\---



\# Key Takeaways



This example introduces the core Parmana execution model.



The important concepts are:



\* Authority establishes trust.

\* Authorization grants permission.

\* Intent describes requested work.

\* BusinessTransaction binds the request.

\* Policy evaluates the request.

\* Runtime executes deterministically.

\* Receipt proves execution.



These concepts form the foundation for every subsequent example.



\---



\# Related Examples



\* Example 02 — Verify Receipt

\* Example 03 — Replay Execution

\* Example 04 — Audit Trust Chain



\---



\# Next Step



Continue with:



```text

python/docs/02\_verify\_receipt.md

```



to learn how Parmana independently verifies execution receipts and execution trust records.



