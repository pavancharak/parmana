\# Parmana Python SDK Examples



\## Overview



The Parmana Python SDK includes a progressive set of examples that demonstrate how to build trustworthy AI and autonomous systems using Parmana's Execution Trust Infrastructure.



Each example introduces one new capability while building on concepts introduced in previous examples.



The examples are intended to be completed in order.



\---



\# Learning Path



| Example | Topic                 | New Capability                            |

| ------- | --------------------- | ----------------------------------------- |

| 01      | Basic Execution       | Execute a Business Transaction            |

| 02      | Verify Receipt        | Verify cryptographic execution receipts   |

| 03      | Replay Execution      | Deterministic execution replay            |

| 04      | Audit Trust Chain     | Inspect a complete Execution Trust Record |

| 05      | Human in the Loop     | Human approval and override workflows     |

| 06      | Autonomous Vehicle    | Governance for autonomous systems         |

| 07      | Medical AI            | Clinical decision governance              |

| 08      | Financial Transaction | Payment governance and compliance         |

| 09      | Multi-Agent           | Governance across cooperating AI agents   |

| 10      | Custom Policy         | Explicit policy version selection         |



\---



\# Execution Trust Chain



Every example demonstrates the same canonical trust chain.



```

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

Evidence

&#x20;     ↓

Verification

&#x20;     ↓

Receipt

&#x20;     ↓

Execution Trust Record

```



This trust chain is the foundation of Parmana.



\---



\# Example Directory



```

python/

└── examples/

&#x20;   ├── 01\_basic\_execution.py

&#x20;   ├── 02\_verify\_receipt.py

&#x20;   ├── 03\_replay\_execution.py

&#x20;   ├── 04\_audit\_trust\_chain.py

&#x20;   ├── 05\_human\_in\_the\_loop.py

&#x20;   ├── 06\_autonomous\_vehicle.py

&#x20;   ├── 07\_medical\_ai.py

&#x20;   ├── 08\_financial\_transaction.py

&#x20;   ├── 09\_multi\_agent.py

&#x20;   └── 10\_custom\_policy.py

```



Each example has a matching document in:



```

python/docs/

```



\---



\# Intended Audience



The examples are intended for:



\* AI Platform Engineers

\* Autonomous Systems Engineers

\* Robotics Engineers

\* Product Engineers

\* Security Engineers

\* Compliance Engineers

\* Platform Architects

\* AI Governance Teams



\---



\# Core Concepts



The examples introduce the following Parmana concepts:



\* Authority

\* Authorization

\* Intent

\* Business Transaction

\* Policy Reference

\* Decision

\* Execution

\* Execution Evidence

\* Verification

\* Receipt

\* Execution Trust Record



\---



\# Design Principles



Every example follows the same principles:



\* Immutable trust artifacts

\* Deterministic execution

\* Explicit policy selection

\* Independent verification

\* Cryptographic evidence

\* Replayability

\* Auditability



\---



\# What Parmana Does



Parmana governs execution.



Parmana records evidence.



Parmana enables verification.



Parmana provides replay.



Parmana creates cryptographically verifiable execution trust chains.



\---



\# What Parmana Does Not Do



Parmana is not:



\* an LLM

\* an AI model

\* an agent framework

\* a workflow engine

\* a robotics controller

\* an autonomous driving system

\* a medical diagnosis system

\* a payment processor



Instead, Parmana provides execution trust infrastructure that can be integrated with these systems.



\---



\# Next Steps



Work through the examples in numerical order.



Each example introduces one new concept while reinforcing the canonical Parmana execution trust architecture.



