\# Example 02 — Verify Receipt



\## Overview



This example introduces receipt verification in Parmana.



After a Business Transaction has been executed, Parmana produces a cryptographically verifiable Receipt. Verification confirms that the receipt is authentic, internally consistent, and corresponds to the expected Execution Trust Record.



Verification is independent of execution. A verifier does not need to trust the runtime that originally produced the receipt.



\---



\# Learning Objectives



After completing this example you will understand:



\* Why Parmana generates Receipts

\* What information a Receipt contains

\* How receipt verification works

\* The difference between execution and verification

\* How independent verification strengthens trust



\---



\# Background



Many AI systems can report that an action was completed, but cannot prove it.



For example, an autonomous system may claim:



> "Lane change completed successfully."



Without supporting evidence, there is no way to independently determine:



\* whether the action actually occurred,

\* whether the correct policy was applied,

\* whether the execution record was modified after completion.



Parmana addresses this by producing immutable receipts that can later be verified.



\---



\# Business Problem



Assume a warehouse robot reports:



> Package delivered successfully.



An auditor later asks:



\* Was this the original execution?

\* Was the receipt modified?

\* Which Business Transaction produced it?

\* Does the receipt correspond to the recorded trust chain?



Without verification, these questions cannot be answered reliably.



\---



\# Parmana Solution



Parmana generates a Receipt immediately after execution.



A Receipt is a cryptographic attestation containing:



\* Receipt identifier

\* Business Transaction identifier

\* Execution identifier

\* Trust Record hash

\* Receipt hash

\* Digital signature

\* Signature algorithm

\* Timestamp



A verifier can independently validate these artifacts.



\---



\# Receipt Lifecycle



```text

BusinessTransaction

&#x20;       ↓

Execution

&#x20;       ↓

Execution Trust Record

&#x20;       ↓

Receipt

&#x20;       ↓

Verification

```



Execution creates evidence.



Verification validates evidence.



\---



\# Receipt Structure



A Receipt contains the minimum information required for independent verification.



| Field                 | Purpose                    |

| --------------------- | -------------------------- |

| receiptId             | Unique receipt identifier  |

| businessTransactionId | Associated transaction     |

| executionId           | Associated execution       |

| trustRecordHash       | Digest of the trust record |

| receiptHash           | Digest of the receipt      |

| signature             | Digital signature          |

| algorithm             | Signature algorithm        |

| issuedAt              | Receipt creation time      |



\---



\# Verification Process



The SDK performs verification through the verification service.



```python

client = ParmanaClient()



verification = client.verify(receipt)

```



Future versions of the SDK will communicate with the Parmana Verification API. In the current SDK, this demonstrates the intended verification workflow.



\---



\# Verification Result



Verification produces a Verification artifact.



Possible outcomes are:



\* VERIFIED

\* FAILED



A successful verification indicates that the receipt matches the expected execution artifacts.



\---



\# Expected Output



A successful verification produces output similar to:



```text

Parmana Receipt Verification



Receipt ID          : ...

Transaction ID      : ...

Trust Record Hash   : ...



Verification



Status              : VERIFIED

Message             : Verification successful.

```



\---



\# Security Considerations



Receipt verification provides several guarantees:



\* Receipt integrity

\* Detection of tampering

\* Cryptographic authenticity

\* Independent validation

\* Replay support



Verification does \*\*not\*\* authorize execution. Authorization occurs before execution; verification occurs afterward.



\---



\# Production Deployment



In production deployments:



\* Receipts should be stored as immutable records.

\* Verification may occur immediately after execution or during later audits.

\* Independent parties can verify receipts without trusting the execution environment.

\* Receipt hashes can be compared against archived Execution Trust Records.



\---



\# Real-World Applications



Receipt verification is useful in:



\* Autonomous vehicles

\* Robotics

\* Healthcare

\* Banking

\* Supply chain systems

\* Government workflows

\* Enterprise AI platforms



In each case, verification provides evidence that execution occurred as recorded.



\---



\# Relationship to the Trust Chain



Receipt verification operates on the artifacts produced by execution.



```text

Authority

&#x20;     ↓

Authorization

&#x20;     ↓

Intent

&#x20;     ↓

Business Transaction

&#x20;     ↓

Decision

&#x20;     ↓

Execution

&#x20;     ↓

Receipt

&#x20;     ↓

Verification

```



Verification strengthens confidence in the complete execution trust chain.



\---



\# Best Practices



\* Preserve receipts after execution.

\* Verify receipts before relying on execution outcomes.

\* Store verification results separately from execution records.

\* Use immutable storage for receipts and trust records.

\* Treat verification failures as security events requiring investigation.



\---



\# Common Pitfalls



Avoid the following assumptions:



\* A receipt is not authorization.

\* Verification does not re-execute the transaction.

\* Verification does not change execution history.

\* A successful execution does not automatically imply successful verification.



\---



\# Summary



Receipt verification is a fundamental capability of Parmana.



Execution answers:



> What happened?



Verification answers:



> Can we independently prove what happened?



Together, execution and verification create a trustworthy foundation for AI and autonomous systems.



\---



\# Related Examples



\* Example 01 — Basic Execution

\* Example 03 — Replay Execution

\* Example 04 — Audit Trust Chain



\---



\# Next Step



Continue with:



```text

python/docs/03\_replay\_execution.md

```



to learn how Parmana deterministically reconstructs and inspects execution history from an Execution Trust Record.



