Yes. Before we document anything, we should \*\*validate that the codebase actually implements the product promise\*\*.



The promise:



> \*\*Parmana ensures AI executes only policy-compliant actions.\*\*



should be traceable through the implementation. If an engineer, auditor, investor, or patent examiner asks, "Where is this enforced?", you should be able to point to specific files.



\## Canonical validation checklist



\### 1. Policy evaluation



Ensures every action is evaluated against policy.



```text

D:\\last\\parmana\\packages\\policy\\src\\PolicyEngine.ts

```



Confirms:



\* Exactly one policy is evaluated.

\* Deterministic `PolicyDecision` is produced.

\* `PolicyOutcome` is returned.



\---



\### 2. Policy routing



Ensures the referenced policy is loaded.



```text

D:\\last\\parmana\\packages\\policy\\src\\PolicyRouter.ts

```



Confirms:



\* Runtime never guesses a policy.

\* BusinessTransaction specifies the policy.



\---



\### 3. Policy validation



```text

D:\\last\\parmana\\packages\\policy\\src\\PolicyValidator.ts

```



Confirms:



\* Policy artifact is structurally valid.



\---



\### 4. Signal validation



```text

D:\\last\\parmana\\packages\\policy\\src\\SignalValidator.ts

```



Confirms:



\* Runtime signals satisfy the policy schema.



\---



\## Runtime authorization



\### 5. Runtime orchestration



```text

D:\\last\\parmana\\packages\\runtime\\src\\RuntimeEngine.ts

```



Confirms:



\* Loads policy.

\* Evaluates policy.

\* Builds Decision.

\* Enforces execution.

\* Produces trust record.



\---



\### 6. Decision creation



```text

D:\\last\\parmana\\packages\\runtime\\src\\DecisionBuilder.ts

```



Confirms:



\* PolicyDecision becomes an immutable Decision.



\---



\### 7. Execution authorization



```text

D:\\last\\parmana\\packages\\runtime\\src\\ExecutionGate.ts

```



This is one of the most important files.



Confirms:



\* Execution only proceeds when:



```text

DecisionOutcome.APPROVED

```



Everything else is rejected.



\---



\### 8. Execution artifact



```text

D:\\last\\parmana\\packages\\runtime\\src\\ExecutionBuilder.ts

```



Confirms:



\* Execution cannot exist without a Decision.



\---



\### 9. Runtime pipeline



```text

D:\\last\\parmana\\packages\\runtime\\src\\RuntimePipeline.ts

```



Confirms:



\* Authorized execution flows through the runtime pipeline.



\---



\## Trust



\### 10. Trust pipeline



```text

D:\\last\\parmana\\packages\\runtime\\src\\ExecutionTrustPipeline.ts

```



Confirms:



\* Every execution produces an Execution Trust Record.



\---



\## Verification



\### 11. Verification engine



```text

D:\\last\\parmana\\packages\\verification\\src\\VerificationEngine.ts

```



Confirms:



\* Trust Records are independently verifiable.



\---



\## Replay



\### 12. Replay engine



```text

D:\\last\\parmana\\packages\\replay\\src\\ReplayEngine.ts

```



Confirms:



\* Decisions can be deterministically replayed.



\---



\## Shared domain



These define the canonical execution model.



\### Decision



```text

D:\\last\\parmana\\packages\\shared\\src\\domain\\decision.ts

```



\---



\### Business Transaction



```text

D:\\last\\parmana\\packages\\shared\\src\\domain\\business-transaction.ts

```



\---



\### Execution



```text

D:\\last\\parmana\\packages\\shared\\src\\domain\\execution.ts

```



\---



\### Execution Trust Record



```text

D:\\last\\parmana\\packages\\shared\\src\\domain\\execution-trust-record.ts

```



\---



\### Verification



```text

D:\\last\\parmana\\packages\\shared\\src\\domain\\verification.ts

```



\---



\## Policy model



\### Policy



```text

D:\\last\\parmana\\packages\\policy\\src\\types\\Policy.ts

```



\---



\### PolicyDecision



```text

D:\\last\\parmana\\packages\\policy\\src\\types\\PolicyDecision.ts

```



\---



\### PolicyOutcome



```text

D:\\last\\parmana\\packages\\policy\\src\\types\\PolicyOutcome.ts

```



\---



\### PolicyAction



```text

D:\\last\\parmana\\packages\\policy\\src\\types\\PolicyAction.ts

```



\---



\# Current product promise validation



Your current implementation supports the following chain:



```text

AI Intent

&#x20;   │

&#x20;   ▼

BusinessTransaction

&#x20;   │

&#x20;   ▼

PolicyRouter

&#x20;   │

&#x20;   ▼

PolicyEngine

&#x20;   │

&#x20;   ▼

PolicyDecision

&#x20;   │

&#x20;   ▼

DecisionBuilder

&#x20;   │

&#x20;   ▼

Decision

&#x20;   │

&#x20;   ▼

ExecutionGate

&#x20;   │

Approved?

&#x20;   │

&#x20;┌──┴──────┐

&#x20;│         │

Yes       No

&#x20;│         │

&#x20;▼         ▼

Execution  Reject

&#x20;│

&#x20;▼

Execution Trust Pipeline

&#x20;│

&#x20;▼

Execution Trust Record

&#x20;│

&#x20;▼

Verification

```



\## Assessment



Based on the architecture you've shared, your implementation substantiates the claim:



> \*\*Parmana ensures AI executes only policy-compliant actions.\*\*



with one important architectural assumption:



\* \*\*AI actions must be executed through Parmana's Runtime and `ExecutionGate`.\*\*



That scope should be stated consistently in your documentation. Within that execution path, the codebase provides a clear, auditable chain from policy evaluation to execution enforcement and verification. This file inventory will also serve as an excellent reference when writing the README, architecture guide, and any future patent or technical documentation.



For the specific claim:



> \*\*"Parmana ensures AI executes only policy-compliant actions."\*\*



an engineer should be able to verify it by reading a small set of core files. These are the canonical evidence files.



| Responsibility                                     | File                                                                 |

| -------------------------------------------------- | -------------------------------------------------------------------- |

| Runtime loads the requested policy                 | `D:\\last\\parmana\\packages\\runtime\\src\\RuntimeEngine.ts`              |

| Policy is evaluated deterministically              | `D:\\last\\parmana\\packages\\policy\\src\\PolicyEngine.ts`                |

| PolicyDecision becomes a Decision                  | `D:\\last\\parmana\\packages\\runtime\\src\\DecisionBuilder.ts`            |

| Execution is allowed only for approved decisions   | `D:\\last\\parmana\\packages\\runtime\\src\\ExecutionGate.ts`              |

| Execution artifact is created after approval       | `D:\\last\\parmana\\packages\\runtime\\src\\ExecutionBuilder.ts`           |

| Runtime execution pipeline                         | `D:\\last\\parmana\\packages\\runtime\\src\\RuntimePipeline.ts`            |

| Trust record generation                            | `D:\\last\\parmana\\packages\\runtime\\src\\ExecutionTrustPipeline.ts`     |

| Canonical Decision model                           | `D:\\last\\parmana\\packages\\shared\\src\\domain\\decision.ts`             |

| Canonical Execution model                          | `D:\\last\\parmana\\packages\\shared\\src\\domain\\execution.ts`            |

| BusinessTransaction (contains the PolicyReference) | `D:\\last\\parmana\\packages\\shared\\src\\domain\\business-transaction.ts` |

| Policy definition                                  | `D:\\last\\parmana\\packages\\policy\\src\\types\\Policy.ts`                |

| PolicyDecision contract                            | `D:\\last\\parmana\\packages\\policy\\src\\types\\PolicyDecision.ts`        |

| PolicyOutcome enum                                 | `D:\\last\\parmana\\packages\\policy\\src\\types\\PolicyOutcome.ts`         |

| PolicyAction enum                                  | `D:\\last\\parmana\\packages\\policy\\src\\types\\PolicyAction.ts`          |



\## If I were auditing Parmana



These are the \*\*five files\*\* I'd read first:



```text

packages/runtime/src/RuntimeEngine.ts

packages/policy/src/PolicyEngine.ts

packages/runtime/src/DecisionBuilder.ts

packages/runtime/src/ExecutionGate.ts

packages/runtime/src/ExecutionBuilder.ts

```



If these five files are correct, they demonstrate the core enforcement path:



```text

BusinessTransaction

&#x20;       │

&#x20;       ▼

PolicyEngine

&#x20;       │

PolicyDecision

&#x20;       │

DecisionBuilder

&#x20;       │

Decision

&#x20;       │

ExecutionGate

&#x20;       │

Approved?

&#x20;       │

&#x20;       ▼

ExecutionBuilder

&#x20;       │

Execution

```



That chain is the primary implementation evidence supporting the claim that \*\*Parmana ensures AI executes only policy-compliant actions\*\* (for actions executed through Parmana). The remaining files provide the domain definitions, trust record generation, and verification that complete the overall execution trust infrastructure.





