# Parmana

> **Proof of Human Authority in AI Systems**

## Parmana ensures AI executes only policy-compliant actions.

Parmana is an execution authorization infrastructure for AI systems. It evaluates every requested AI action against organizational policy before execution, produces a deterministic authorization decision, and generates cryptographically verifiable execution evidence.

Unlike AI orchestration frameworks that focus on what AI can do, Parmana focuses on **what AI is allowed to do**.

Organizations use Parmana to ensure AI actions are authorized, policy-compliant, auditable, and independently verifiable.

---

# The Problem

Organizations cannot confidently deploy autonomous AI in high-impact workflows because they cannot ensure every AI action complies with business policy, regulatory requirements, and human authority.

Today's AI systems can generate decisions and execute actions, but most organizations cannot answer critical questions such as:

* Was this action authorized?
* Which policy approved it?
* Which business intent was evaluated?
* What evidence supports the execution?
* Can the execution be independently verified?

Without trustworthy execution authorization, AI cannot safely operate in regulated or mission-critical environments.

---

# The Solution

Parmana introduces an execution authorization layer between AI systems and execution systems.

Every requested action is evaluated before execution.

If the action satisfies organizational policy, Parmana authorizes execution.

If the action violates policy, Parmana prevents execution.

Every authorization decision produces immutable execution evidence that can later be independently verified.

---

# How Parmana Works

```text
                 AI System
                     │
                     ▼
                 AI Intent
                     │
                     ▼
        Parmana Authorization Runtime
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
 Load Policy   Evaluate Policy   Create Decision
                     │
                     ▼
          Execution Authorization
                     │
             Approved / Rejected
                     │
                     ▼
             Execution System
                     │
                     ▼
          Execution Evidence
                     │
                     ▼
        Execution Trust Record
                     │
                     ▼
       Independent Verification
```

Only Parmana-approved actions are executed.

---

# Core Concepts

## Authority

The human, organization, or system that possesses the authority to permit an action.

---

## Authorization

The explicit permission allowing an Intent to be evaluated for execution.

Authorization establishes who is allowed to request an action.

---

## Intent

The requested business operation.

Intent defines **what** is being requested, independent of how it will be executed.

---

## Policy Reference

A versioned reference to the organizational policy that governs the requested action.

Policies are immutable and deterministic.

---

## Decision

The deterministic result of evaluating an Intent against a Policy.

A Decision records:

* Policy evaluated
* Runtime signals
* Decision outcome
* Decision reason
* Evaluation timestamp

A Decision never performs execution.

---

## Execution

Execution is the authorized performance of the requested operation.

Execution occurs only after a successful Decision.

---

## Execution Trust Record

The immutable trust artifact produced after execution.

It links the complete authorization-to-execution chain into cryptographically verifiable evidence.

---

## Verification

Verification independently proves that an execution occurred exactly as recorded.

Verification does not require the original application or runtime.

---

# Execution Lifecycle

Every execution follows the same deterministic lifecycle.

```text
Authority
      │
Authorization
      │
Intent
      │
Policy Reference
      │
Business Transaction
      │
Policy Evaluation
      │
Decision
      │
Execution Authorization
      │
Execution
      │
Execution Evidence
      │
Execution Trust Record
      │
Verification
```

Each artifact is immutable and contributes to the overall trust chain.

---

# Key Guarantees

Parmana provides the following guarantees for every authorized execution:

* AI executes only policy-compliant actions.
* Every execution is explicitly authorized.
* Policy evaluation is deterministic.
* Every execution produces immutable evidence.
* Every trust record is cryptographically verifiable.
* Every execution can be independently audited.
* Policy evaluation and execution are cleanly separated.
* Human authority is preserved throughout the execution lifecycle.

---

# Architectural Principles

Parmana is designed around several fundamental principles.

## Authorization Before Execution

Execution never occurs before policy evaluation.

---

## Deterministic Decisions

The same policy and inputs always produce the same decision.

---

## Immutable Trust Artifacts

Authorization and execution artifacts are never modified after creation.

---

## Independent Verification

Execution evidence can be verified without trusting the original runtime.

---

## Separation of Responsibilities

Parmana separates:

* Policy evaluation
* Authorization
* Execution
* Evidence generation
* Verification

Each component has a single well-defined responsibility.

---

# Package Overview

```text
packages/
├── api
├── crypto
├── policy
├── replay
├── runtime
├── shared
├── storage
└── verification
```

Each package provides a focused capability within the overall execution trust infrastructure.

---

# Quick Start

Install the project:

```bash
npm install
```

Build all packages:

```bash
npm run build
```

Run the test suite:

```bash
npm test
```

---

# Documentation

## Concepts

* Authority
* Authorization
* Intent
* Policy Reference
* Decision
* Execution
* Execution Trust Record
* Verification

## Guides

* Basic Execution
* Receipt Verification
* Deterministic Replay
* Trust Chain Audit
* Human Override
* Autonomous Systems
* Medical AI
* Financial Governance
* Multi-Agent Systems
* Custom Policies

---

# Design Philosophy

Most AI infrastructure focuses on helping AI perform more actions.

Parmana focuses on ensuring AI performs only the **right** actions.

It establishes a deterministic authorization layer that organizations can trust before allowing AI to execute business operations.

The result is AI that is not only capable, but accountable.

---

# Canonical Product Promise

> **Parmana ensures AI executes only policy-compliant actions.**

This is the foundational guarantee of the Parmana Execution Trust Infrastructure.

---

# License

See the LICENSE file for licensing information.
