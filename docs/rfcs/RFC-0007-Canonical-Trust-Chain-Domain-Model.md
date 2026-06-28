\# RFC-0007



\# Canonical Trust Chain Domain Model



\## Status



Draft



\---



\# Problem



Current implementation models policy evaluation.



Parmana must model trust.



Trust begins \*\*before policy evaluation\*\*.



\---



\# Core Principle



Every link in the trust chain is an immutable artifact.



No link should be implied.



No link should be reconstructed.



No link should be hidden.



\---



\# Canonical Domain Model



```text

Authority

&#x20;       ↓

Authorization

&#x20;       ↓

Intent

&#x20;       ↓

PolicyReference

&#x20;       ↓

Decision

&#x20;       ↓

BusinessTransaction

&#x20;       ↓

Execution

&#x20;       ↓

ExecutionEvidence

&#x20;       ↓

Verification

&#x20;       ↓

Receipt

```



\---



\# Artifact Responsibilities



\## Authority



Represents the entity empowered to authorize execution.



Questions answered:



\* Who possesses authority?

\* Under which identity?

\* Under which organization?



\---



\## Authorization



Represents delegated permission.



Questions answered:



\* What execution is permitted?

\* What constraints exist?

\* What scope was granted?



\---



\## Intent



Represents the desired outcome.



Questions answered:



\* What should happen?

\* Which target?

\* Which parameters?



Intent exists before policy.



\---



\## PolicyReference



Identifies the policy used.



Questions answered:



\* Which policy?

\* Which version?



Policy never contains intent.



Policy never contains authority.



\---



\## Decision



Decision records policy evaluation.



Questions answered:



\* Approved?

\* Rejected?

\* Why?



Decision never owns authority.



Decision never owns intent.



Decision never owns authorization.



\---



\## BusinessTransaction



BusinessTransaction becomes the immutable business state.



```text

BusinessTransaction



metadata



authority



authorization



intent



policy



signals



decision



status

```



\---



\## Execution



Execution records what actually occurred.



Execution never determines authorization.



Execution never evaluates policy.



Execution never changes intent.



\---



\## ExecutionEvidence



Evidence records observable facts.



Examples:



\* hashes



\* logs



\* traces



\* outputs



\* signatures



Evidence never decides.



\---



\## Verification



Verification answers one question:



Does observed execution match the approved trust chain?



Not merely:



Did execution complete?



\---



\## Receipt



Receipt certifies the trust record state.



\---



\# Execution Trust Record



ExecutionTrustRecord becomes:



```text

ExecutionTrustRecord



BusinessTransaction



Execution\[]



Verification\[]



Receipt\[]

```



BusinessTransaction already contains:



Authority



↓



Authorization



↓



Intent



↓



Policy



↓



Decision



Therefore the complete trust chain becomes part of the canonical trust record.



\---



\# Design Rules



Every artifact:



\* immutable



\* independently identifiable



\* serializable



\* hashable



\* replayable



\* verifiable



No artifact owns another artifact's responsibility.



Every trust-chain link must be independently inspectable.



\---



\# Migration Plan



Phase 1



Introduce Authority.



Introduce Authorization.



Introduce Intent.



Phase 2



Update BusinessTransaction.



Phase 3



Update builders.



Phase 4



Update runtime.



Phase 5



Update verification.



Phase 6



Update replay.



Phase 7



Update API.



\---



\# Success Criteria



A verifier should answer these questions without trusting the runtime:



1\. Who possessed authority?



2\. What authorization existed?



3\. What intent was approved?



4\. Which policy evaluated the request?



5\. What decision was produced?



6\. What execution occurred?



7\. What evidence was produced?



8\. Does execution match the approved intent?



9\. Can another verifier independently reach the same conclusion?



Only then has Parmana implemented a complete cryptographically verifiable execution trust chain.



