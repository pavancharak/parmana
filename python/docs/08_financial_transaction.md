\# Example 08 — Financial Transaction



\## Overview



This example demonstrates how Parmana provides \*\*Execution Trust Infrastructure\*\* for AI-assisted financial transaction workflows.



Parmana is \*\*not\*\* a banking system, payment processor, fraud detection engine, or Anti-Money Laundering (AML) platform.



Instead, Parmana governs the execution of financial transactions by ensuring that every payment request, authorization, policy evaluation, execution, and verification is recorded as a cryptographically verifiable execution trust chain.



In this example, a high-value payment request is evaluated against financial governance policies before execution. Parmana records every stage of the workflow as immutable trust artifacts.



\---



\# Learning Objectives



After completing this example you will understand:



\* How Parmana fits into modern financial architectures

\* How payment requests become Business Transactions

\* Why policy-governed execution is critical in regulated environments

\* How financial execution evidence is recorded

\* How payments become independently verifiable



\---



\# Background



Financial institutions increasingly rely on AI to assist with:



\* Fraud detection

\* AML screening

\* Risk scoring

\* Payment routing

\* Credit decisions

\* Customer authentication

\* Transaction monitoring



While AI can improve operational efficiency, financial institutions remain responsible for demonstrating:



\* Who authorized a payment

\* Which governance policy approved it

\* Which risk signals were evaluated

\* Why the payment was permitted

\* What was executed

\* Whether the execution can be independently verified



Parmana provides the execution trust layer connecting these systems.



\---



\# Business Problem



Consider an international payment of \*\*USD 25,000\*\*.



Months later, an internal auditor investigates the transaction.



Questions include:



\* Which employee or system authorized the payment?

\* Which AML policy version was evaluated?

\* What fraud signals were considered?

\* Was sanctions screening performed?

\* Was the payment successfully executed?

\* Can regulators independently verify the execution?



Without centralized governance, these answers require reconstructing information from multiple banking systems.



Parmana instead provides a single immutable Execution Trust Record.



\---



\# Parmana Solution



Parmana governs the payment execution lifecycle.



It records:



\* Bank authority

\* Customer authorization

\* Payment intent

\* Policy reference

\* Risk evaluation

\* Decision

\* Payment execution

\* Verification

\* Receipt



Every stage becomes an immutable trust artifact.



\---



\# Financial Architecture



```text

Bank

&#x20;     │

&#x20;     ▼

Authority

&#x20;     │

&#x20;     ▼

Authorization

&#x20;     │

&#x20;     ▼

Payment Intent

&#x20;     │

&#x20;     ▼

Business Transaction

&#x20;     │

&#x20;     ▼

AML / Fraud Policy

&#x20;     │

&#x20;     ▼

Decision

&#x20;     │

&#x20;     ▼

Payment Execution

&#x20;     │

&#x20;     ▼

Execution Evidence

&#x20;     │

&#x20;     ▼

Verification

&#x20;     │

&#x20;     ▼

Receipt

&#x20;     │

&#x20;     ▼

Execution Trust Record

```



Parmana governs execution rather than replacing existing banking infrastructure.



\---



\# Example Scenario



A customer initiates an international supplier payment.



The payment request includes:



\* Amount

\* Currency

\* Destination account

\* Business purpose



The Business Transaction references a specific AML and fraud policy.



The runtime evaluates policy-relevant signals before approving execution.



\---



\# Runtime Signals



Typical signals include:



\* Know Your Customer (KYC) verification

\* AML screening result

\* Fraud risk score

\* Sanctions screening

\* Transaction amount

\* Geographic risk

\* Velocity checks

\* Customer history



These signals become immutable evidence supporting future replay and audit.



\---



\# Policy Evaluation



The referenced policy evaluates the transaction using the supplied runtime signals.



Possible outcomes include:



\* APPROVED

\* REJECTED



In this example:



\* KYC verification succeeds.

\* AML screening passes.

\* No sanctions match is detected.

\* Fraud score is within acceptable limits.



The payment is therefore approved.



\---



\# Payment Execution



Execution records what actually occurred.



Typical execution evidence includes:



\* Payment network

\* Settlement reference

\* Settlement status

\* Completion timestamp

\* Transaction identifiers



Execution evidence reflects the completed financial operation rather than the original request.



\---



\# Verification



Verification confirms:



\* Trust Record integrity

\* Execution consistency

\* Artifact completeness

\* Successful payment execution



Verification produces an immutable Verification artifact.



\---



\# Receipt



Every completed payment produces a Receipt.



Typical receipt contents include:



\* Receipt identifier

\* Trust Record hash

\* Receipt hash

\* Digital signature

\* Signature algorithm

\* Timestamp



Receipts allow auditors, regulators, and counterparties to independently verify the transaction.



\---



\# Expected Output



A successful execution produces output similar to:



```text

Parmana Financial Transaction



Bank             : Acme National Bank

Customer         : customer-1001

Amount           : $25,000.00

Currency         : USD



Governance



Policy           : aml-fraud-policy

Decision         : APPROVED

Reason           : Transaction satisfies AML and fraud policies.



Execution



Status           : COMPLETED

Settlement       : SETTLED



Verification



Status           : VERIFIED



Financial transaction executed with a complete execution trust chain.

```



\---



\# Parmana's Role



Parmana \*\*does not\*\*:



\* Transfer funds

\* Replace payment networks

\* Perform AML screening

\* Detect fraud

\* Maintain account balances

\* Replace banking core systems



Parmana \*\*does\*\*:



\* Record authority

\* Record authorization

\* Record payment intent

\* Evaluate governance policies

\* Record execution

\* Generate receipts

\* Enable replay

\* Enable verification

\* Support audits

\* Preserve immutable execution evidence



\---



\# Production Deployment



Financial institutions may integrate Parmana with:



\* Core Banking Systems

\* Payment Gateways

\* SWIFT

\* ISO 20022 messaging

\* AML Platforms

\* Fraud Detection Systems

\* Identity Providers

\* Treasury Systems

\* Regulatory Reporting Platforms

\* Governance and Risk Management systems



Parmana becomes the execution trust layer connecting these components.



\---



\# Best Practices



\* Use explicit policy versions for every payment.

\* Capture all policy-relevant runtime signals.

\* Preserve execution evidence without modification.

\* Verify every completed payment.

\* Archive Execution Trust Records for regulatory retention periods.

\* Separate payment execution from governance responsibilities.



\---



\# Common Pitfalls



Avoid these misconceptions:



\* Parmana is not a payment processor.

\* Parmana does not replace AML systems.

\* Parmana does not replace fraud detection.

\* Parmana governs execution rather than financial settlement.



Maintaining this separation simplifies integration and improves auditability.



\---



\# Real-World Applications



This execution trust model applies to:



\* Domestic payments

\* International wire transfers

\* Treasury operations

\* Cross-border settlements

\* Digital banking

\* Trade finance

\* Insurance claims

\* Securities settlement

\* Central bank digital currency (CBDC) workflows



Although the financial products differ, the execution trust architecture remains the same.



\---



\# Compliance Benefits



Financial organizations can use Parmana to support:



\* Internal audits

\* Regulatory examinations

\* AML investigations

\* Fraud investigations

\* Operational risk reviews

\* Governance reporting

\* External assurance engagements



The immutable Execution Trust Record provides a single authoritative source for transaction governance.



\---



\# Summary



Financial AI systems require more than accurate risk models—they require trustworthy execution.



Parmana provides a deterministic execution trust chain that records who authorized a payment, which policy governed it, what decision was produced, how the payment was executed, and how the resulting evidence can be independently verified.



This enables financial institutions to adopt AI while maintaining accountability, transparency, and regulatory readiness.



\---



\# Related Examples



\* Example 07 — Medical AI

\* Example 09 — Multi-Agent

\* Example 10 — Custom Policy



\---



\# Next Step



Continue with:



```text

python/docs/09\_multi\_agent.md

```



to learn how Parmana governs coordinated AI agent workflows while maintaining a single, verifiable execution trust chain across multiple autonomous components.



