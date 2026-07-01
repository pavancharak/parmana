\# Example 07 — Medical AI



\## Overview



This example demonstrates how Parmana provides \*\*execution trust infrastructure\*\* for AI-assisted clinical workflows.



Parmana is \*\*not\*\* a medical diagnosis system, clinical decision support engine, or electronic health record (EHR).



Instead, Parmana governs the execution of AI-assisted clinical recommendations by ensuring every recommendation, approval, execution, and verification is recorded in a cryptographically verifiable execution trust chain.



In this example, an AI system recommends a treatment for a patient. A physician reviews and approves the recommendation before execution. Parmana records the complete lifecycle as immutable trust artifacts.



\---



\# Learning Objectives



After completing this example you will understand:



\* How Parmana integrates with clinical AI systems

\* Why physician approval remains essential

\* How clinical recommendations become Business Transactions

\* How clinical policies govern execution

\* How medical decisions become independently verifiable



\---



\# Background



Healthcare is one of the most highly regulated domains for AI.



AI systems can:



\* Recommend diagnoses

\* Suggest treatments

\* Identify abnormal imaging

\* Predict clinical deterioration

\* Prioritize patient triage



However, healthcare organizations must still answer critical governance questions:



\* Who authorized the recommendation?

\* Which clinical policy was applied?

\* What patient context was evaluated?

\* Who approved the recommendation?

\* What treatment was ultimately executed?

\* Can the decision be independently audited?



Parmana provides the execution trust layer that answers these questions.



\---



\# Business Problem



Consider an AI system that recommends prescribing an antibiotic for a patient diagnosed with community-acquired pneumonia.



Several months later, a clinical audit investigates the case.



The auditors need to determine:



\* Which physician reviewed the recommendation?

\* Which clinical policy governed the decision?

\* Was the patient eligible for the treatment?

\* Was the recommendation approved or overridden?

\* What treatment was actually prescribed?



Without structured governance, investigators must manually reconstruct the decision from multiple clinical systems.



Parmana instead provides a single immutable Execution Trust Record.



\---



\# Parmana Solution



Parmana governs the execution lifecycle of AI-assisted clinical decisions.



It records:



\* Hospital authority

\* Physician authorization

\* Clinical intent

\* Policy reference

\* AI decision

\* Physician approval

\* Execution

\* Verification

\* Receipt



Every artifact becomes part of the immutable trust chain.



\---



\# Clinical Workflow Architecture



```text

Hospital

&#x20;     │

&#x20;     ▼

Authority

&#x20;     │

&#x20;     ▼

Physician Authorization

&#x20;     │

&#x20;     ▼

Clinical Intent

&#x20;     │

&#x20;     ▼

Business Transaction

&#x20;     │

&#x20;     ▼

Clinical Policy

&#x20;     │

&#x20;     ▼

Decision

&#x20;     │

&#x20;     ▼

Physician Approval

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

```



The physician remains responsible for approving treatment. Parmana records and governs the workflow.



\---



\# Example Scenario



An AI assistant recommends:



> Prescribe Amoxicillin for community-acquired pneumonia.



The recommendation includes supporting information such as:



\* Patient age

\* Allergy status

\* Renal function

\* Clinical confidence



The physician reviews the recommendation and approves treatment.



Parmana records the approval without modifying the original AI recommendation.



\---



\# Clinical Policy



The Business Transaction references a specific version of the clinical treatment policy.



Example:



```python

PolicyReference(

&#x20;   policy\_name="clinical-treatment-policy",

&#x20;   policy\_version="2026.1",

)

```



This explicit reference ensures that future audits know exactly which policy governed the recommendation.



\---



\# Decision



The Decision records the outcome of policy evaluation.



Typical runtime signals may include:



\* Drug allergy status

\* Renal function

\* Pregnancy status

\* Age

\* Contraindications

\* Required laboratory values



These signals support deterministic replay and independent verification.



\---



\# Physician Approval



Clinical responsibility remains with the physician.



The physician approval records:



\* Reviewer identity

\* Approval reason

\* Optional justification

\* Timestamp



The approval extends the trust chain while preserving the original AI recommendation.



\---



\# Execution



Execution represents the clinical action that occurred.



Examples include:



\* Prescription issued

\* Laboratory order created

\* Imaging request submitted

\* Care plan updated

\* Electronic health record updated



Execution evidence records what actually occurred rather than what was merely recommended.



\---



\# Verification



Verification confirms:



\* Trust Record integrity

\* Artifact consistency

\* Successful execution

\* Complete trust chain



Verification produces a permanent Verification artifact.



\---



\# Receipt



Every completed execution generates a Receipt.



Typical contents include:



\* Receipt identifier

\* Trust Record hash

\* Digital signature

\* Signature algorithm

\* Timestamp



Receipts enable independent clinical audits.



\---



\# Expected Output



A successful execution produces output similar to:



```text

Parmana Medical AI



Hospital          : City General Hospital

Physician         : Dr. Sarah Johnson

Patient           : patient-12345



AI Recommendation



Diagnosis         : Community Acquired Pneumonia

Treatment         : Amoxicillin

Confidence        : 0.96



Governance



Decision          : APPROVED

Policy            : clinical-treatment-policy

Physician Review  : Approved



Verification



Status            : VERIFIED



Clinical recommendation executed with a complete execution trust chain.

```



\---



\# Parmana's Role



Parmana \*\*does not\*\*:



\* Diagnose patients

\* Replace physicians

\* Generate prescriptions

\* Interpret medical images

\* Make clinical decisions



Parmana \*\*does\*\*:



\* Record authority

\* Record authorization

\* Record intent

\* Evaluate policies

\* Record physician approvals

\* Record execution

\* Generate receipts

\* Enable verification

\* Support replay

\* Enable auditing



\---



\# Production Deployment



Healthcare organizations may integrate Parmana with:



\* Electronic Health Record (EHR) systems

\* Clinical Decision Support Systems (CDSS)

\* Laboratory Information Systems (LIS)

\* Pharmacy Management Systems

\* Hospital Identity Providers

\* Clinical Policy Engines

\* Compliance and Audit Platforms



Parmana becomes the governance layer connecting these systems while preserving an immutable execution trust chain.



\---



\# Best Practices



\* Require physician approval for clinical actions.

\* Use explicit policy versions.

\* Capture policy-relevant clinical signals.

\* Preserve AI recommendations without modification.

\* Record execution evidence.

\* Verify every completed clinical workflow.

\* Archive Execution Trust Records for regulatory compliance.



\---



\# Common Pitfalls



Avoid these misconceptions:



\* Parmana is not a clinical decision support system.

\* Parmana does not replace physician judgment.

\* Parmana does not practice medicine.

\* Parmana governs execution rather than diagnosis.



Maintaining this separation is essential for safe and accountable AI deployment.



\---



\# Real-World Applications



This governance model applies to:



\* AI-assisted diagnosis

\* Treatment recommendations

\* Medication approvals

\* Radiology workflows

\* Pathology review

\* Oncology treatment planning

\* Intensive care monitoring

\* Clinical research



Although clinical use cases vary, the execution trust architecture remains consistent.



\---



\# Summary



AI can improve healthcare by assisting clinicians, but trustworthy deployment requires more than accurate recommendations.



Parmana provides a deterministic execution trust chain that records who authorized a clinical action, which policy governed it, what recommendation was produced, who approved it, what was executed, and how the outcome can be independently verified.



This enables healthcare organizations to adopt AI while maintaining accountability, transparency, and regulatory readiness.



\---



\# Related Examples



\* Example 05 — Human in the Loop

\* Example 06 — Autonomous Vehicle

\* Example 08 — Financial Transaction



\---



\# Next Step



Continue with:



```text

python/docs/08\_financial\_transaction.md

```



to explore how Parmana governs AI-assisted payment authorization and financial execution workflows while maintaining a complete, verifiable execution trust chain.



