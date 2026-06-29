\# Parmana Guarantees



Version: 1.0



This document defines the implementation guarantees provided by

Parmana.



A guarantee is stronger than a feature.



A feature describes what the software does.



A guarantee describes what the implementation prevents,

enforces, or proves.



Every guarantee must satisfy four requirements.



\- Implemented

\- Tested

\- Audited

\- Verifiable



A guarantee is considered complete only when all four

requirements are satisfied.



\---



\# Guarantee Matrix



| ID | Guarantee | Implemented | Tested | Audited | Proven |

|----|-----------|-------------|--------|---------|--------|

| G-01 | Trusted Business Transaction | ⬜ | ⬜ | ⬜ | ⬜ |

| G-02 | Deterministic Policy Selection | ⬜ | ⬜ | ⬜ | ⬜ |

| G-03 | Deterministic Policy Evaluation | ⬜ | ⬜ | ⬜ | ⬜ |

| G-04 | Authorized Execution | ⬜ | ⬜ | ⬜ | ⬜ |

| G-05 | Execution Trust Record Integrity | ⬜ | ⬜ | ⬜ | ⬜ |

| G-06 | Receipt Authenticity | ⬜ | ⬜ | ⬜ | ⬜ |

| G-07 | Independent Verification | ⬜ | ⬜ | ⬜ | ⬜ |

| G-08 | Deterministic Replay | ⬜ | ⬜ | ⬜ | ⬜ |

| G-09 | API Enforcement | ⬜ | ⬜ | ⬜ | ⬜ |

| G-10 | End-to-End Execution Trust | ⬜ | ⬜ | ⬜ | ⬜ |



\---



\# G-01 Trusted Business Transaction



\## Statement



Parmana accepts only Business Transactions that satisfy the

canonical execution trust chain.



No Business Transaction may enter runtime execution unless its

trust relationships are internally consistent.



\---



\## Trust Chain



Authority

↓



Authorization

↓



Intent

↓



BusinessTransaction

↓



PolicyReference



\---



\## Implementation



BusinessTransactionValidator



packages/runtime/src/validators/BusinessTransactionValidator.ts



\---



\## Invariants



The runtime validates the following invariants.



\### G-01.1



metadata.businessTransactionId



must equal



businessTransactionId



Status



✅ Implemented



\---



\### G-01.2



authorization.authorityId



must equal



authority.authorityId



Status



✅ Implemented



\---



\### G-01.3



intent.authorizationId



must equal



authorization.authorizationId



Status



✅ Implemented



\---



\### G-01.4



policy.name



must not be empty.



Status



✅ Implemented



\---



\### G-01.5



policy.version



must not be empty.



Status



✅ Implemented



\---



\### G-01.6



intent.action



must not be empty.



Status



✅ Implemented



\---



\## Threats Prevented



This guarantee prevents:



\- orphan Authorizations



\- orphan Intents



\- mismatched Authorities



\- mismatched Business Transactions



\- missing Policy References



\- incomplete execution requests



\---



\## Evidence



Implementation



packages/runtime/src/validators/BusinessTransactionValidator.ts



Audit



examples/audit/AS-001-approved-vendor-payment/AUDIT.md



Status



Implemented



Audited



Pending Tests



Independent Verification



\---



\# G-02 Deterministic Policy Selection



\## Statement



Parmana executes exactly one explicitly referenced policy.



The runtime never discovers, searches, selects, or substitutes

business policies.



Policy selection occurs before runtime execution.



The Business Transaction completely determines which policy will

execute.



\---



\## Trust Chain



BusinessTransaction



↓



PolicyReference



↓



PolicyRouter



↓



PolicyValidator



↓



PolicyEngine



\---



\## Implementation



PolicyRouter



packages/runtime/src/policy/PolicyRouter.ts



PolicyValidator



packages/runtime/src/policy/PolicyValidator.ts



\---



\## Guarantees



\### G-02.1



Exactly one policy is loaded.



Status



✅ Implemented



\---



\### G-02.2



Policy identity must equal PolicyReference.name.



Status



✅ Implemented



\---



\### G-02.3



Policy version must equal PolicyReference.version.



Status



✅ Implemented



\---



\### G-02.4



Policy schema version must equal

PolicyReference.schemaVersion.



Status



✅ Implemented



\---



\### G-02.5



The loaded policy must contain:



\- signalsSchema



\- rules



\- valid rule identifiers



\- rule conditions



\- rule outcomes



Status



✅ Implemented



\---



\## Runtime Properties



The runtime never:



\- discovers policies



\- scans directories



\- selects latest version



\- performs policy negotiation



\- falls back to another version



\---



\## Threats Prevented



\- Wrong policy execution



\- Version drift



\- Policy substitution



\- Runtime policy discovery



\- Silent policy upgrades



\- Policy ambiguity



\---



\## Evidence Matrix



| Requirement | Status | Evidence |

|------------|--------|----------|

| Implemented | ✅ | PolicyRouter + PolicyValidator |

| Tested | ⬜ | Pending |

| Audited | ✅ | AS-001 Audit |

| Independently Verifiable | ⬜ | Pending |



\---



\# G-03 Deterministic Policy Evaluation



\## Statement



Parmana deterministically evaluates the explicitly referenced policy

against the supplied runtime signals.



For the same:



\- Policy

\- Policy Version

\- Runtime Signals



the Policy Engine produces the same decision outcome and evaluation

path.



\---



\## Execution Flow



Business Transaction



↓



Policy



↓



Signals



↓



Policy Engine



↓



Decision



↓



Execution



\---



\## Implementation



PolicyEngine



packages/policy/src/PolicyEngine.ts



\---



\## Guarantees



\### G-03.1



Rules are evaluated sequentially.



Status



✅ Implemented



\---



\### G-03.2



Evaluation stops at the first matching rule.



Status



✅ Implemented



\---



\### G-03.3



Nested AND conditions are supported.



Status



✅ Implemented



\---



\### G-03.4



Nested OR conditions are supported.



Status



✅ Implemented



\---



\### G-03.5



Every evaluation records:



\- matched rule

\- decision reason

\- evaluation trace

\- evaluated rule count



Status



✅ Implemented



\---



\### G-03.6



A ledger hash is generated for the evaluation result.



Status



✅ Implemented



\---



\## Threats Prevented



\- Non-deterministic rule evaluation

\- Ambiguous policy outcomes

\- Hidden decision paths

\- Undocumented rule selection



\---



\## Current Limitations



The current implementation generates:



\- executionId

\- timestamp



during evaluation.



These values are runtime metadata and do not influence rule selection,

but dependency injection would improve replayability and testability.



\---



\## Evidence Matrix



| Requirement | Status | Evidence |

|------------|--------|----------|

| Implemented | ✅ | PolicyEngine |

| Tested | ⬜ | Pending |

| Audited | ✅ | AS-001 Audit |

| Independently Verifiable | ⬜ | Pending |



\---



\# G-04 Authorized Execution



\## Statement



Parmana executes only Business Transactions that have

successfully completed trust-chain validation and policy evaluation.



Execution is impossible without an APPROVED Decision.



\---



\## Execution Flow



Business Transaction



↓



Trust Chain Validation



↓



Policy Evaluation



↓



Decision (APPROVED)



↓



Execution



\---



\## Implementation



TrustChainValidationComponent



RuntimeEngine



\---



\## Guarantees



\### G-04.1



Authority required.



\### G-04.2



Authorization required.



\### G-04.3



Intent required.



\### G-04.4



Policy required.



\### G-04.5



Decision required.



\### G-04.6



Decision outcome must equal APPROVED.



\### G-04.7



Execution is rejected otherwise.



\---



\## Threats Prevented



\- Unauthorized execution

\- Missing authorization

\- Missing policy

\- Policy bypass

\- Execution before approval



\---



\## Evidence Matrix



| Requirement | Status | Evidence |

|------------|--------|----------|

| Implemented | ✅ | TrustChainValidationComponent |

| Tested | ⬜ | Pending |

| Audited | ✅ | AS-001 Audit |

| Independently Verifiable | ⬜ | Pending |

