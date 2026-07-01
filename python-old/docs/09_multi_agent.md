\# Example 09 — Multi-Agent



\## Overview



This example demonstrates how Parmana provides \*\*Execution Trust Infrastructure\*\* for coordinated AI agent systems.



Modern AI applications increasingly rely on multiple specialized agents working together to accomplish complex tasks. While these agents may collaborate autonomously, organizations still require assurance that every action is authorized, policy-compliant, and independently verifiable.



Parmana provides this assurance by governing the execution lifecycle rather than the agent implementation itself.



In this example, three AI agents collaborate to resolve a customer support request while Parmana records a single, immutable execution trust chain.



\---



\# Learning Objectives



After completing this example you will understand:



\* How Parmana fits into multi-agent architectures

\* How multiple agents share a Business Transaction

\* Why a single trust chain is preferable to fragmented logs

\* How execution evidence captures contributions from multiple agents

\* How coordinated AI systems become independently auditable



\---



\# Background



Large AI systems increasingly consist of specialized agents rather than one monolithic model.



Examples include:



\* Planner Agents

\* Research Agents

\* Coding Agents

\* Evaluation Agents

\* Documentation Agents

\* Execution Agents

\* Monitoring Agents



Each agent performs a different responsibility.



The challenge is not simply coordinating the agents—it is proving that their combined execution followed organizational policies.



Parmana addresses this challenge.



\---



\# Business Problem



Consider an enterprise customer support platform.



A customer submits a request.



Several AI agents collaborate:



\* A Planner Agent determines the workflow.

\* A Research Agent retrieves customer history.

\* An Execution Agent prepares the response.



Months later an auditor asks:



\* Which agents participated?

\* Which policy governed the workflow?

\* Was execution authorized?

\* Did every required agent complete successfully?

\* Can the workflow be independently verified?



Traditional observability systems collect logs from individual agents but rarely provide a unified governance record.



Parmana instead records one canonical Execution Trust Record.



\---



\# Parmana Solution



Parmana governs the execution of the entire workflow.



It records:



\* Organizational authority

\* Workflow authorization

\* Shared business intent

\* Policy reference

\* Policy decision

\* Multi-agent execution

\* Verification

\* Receipt



Individual agent outputs become execution evidence associated with a single Business Transaction.



\---



\# Multi-Agent Architecture



```text

Organization

&#x20;     │

&#x20;     ▼

Authority

&#x20;     │

&#x20;     ▼

Authorization

&#x20;     │

&#x20;     ▼

Shared Business Transaction

&#x20;     │

&#x20;     ▼

Planner Agent

&#x20;     │

&#x20;     ▼

Research Agent

&#x20;     │

&#x20;     ▼

Execution Agent

&#x20;     │

&#x20;     ▼

Policy Evaluation

&#x20;     │

&#x20;     ▼

Decision

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



Parmana governs the workflow without orchestrating the agents themselves.



\---



\# Example Scenario



A customer submits a high-priority support request.



Three AI agents collaborate.



\### Planner Agent



The Planner Agent determines:



\* required workflow

\* execution sequence

\* participating agents



\---



\### Research Agent



The Research Agent retrieves:



\* customer history

\* previous tickets

\* subscription details

\* product information



\---



\### Execution Agent



The Execution Agent:



\* prepares the response

\* generates the solution

\* completes the workflow



\---



\# Shared Business Transaction



Unlike independent executions, all participating agents contribute to the same Business Transaction.



This provides:



\* one Authority

\* one Authorization

\* one Intent

\* one PolicyReference

\* one Decision

\* one Execution Trust Record



The workflow remains unified even though multiple autonomous components participate.



\---



\# Execution Evidence



Execution evidence captures the output of every participating agent.



Example:



```python

{

&#x20;   "planner": {

&#x20;       "agent": "PlannerAgent",

&#x20;       "result": "Workflow generated"

&#x20;   },

&#x20;   "research": {

&#x20;       "agent": "ResearchAgent",

&#x20;       "result": "Customer history retrieved"

&#x20;   },

&#x20;   "execution": {

&#x20;       "agent": "ExecutionAgent",

&#x20;       "result": "Support response prepared"

&#x20;   }

}

```



Execution evidence remains intentionally flexible because different agent frameworks produce different outputs.



\---



\# Policy Evaluation



Before execution completes, Parmana evaluates the referenced governance policy.



Typical runtime signals include:



\* Planner completed

\* Research completed

\* Required agents participated

\* Safety checks passed

\* Confidence threshold satisfied



Only then does the workflow proceed.



\---



\# Verification



Verification confirms:



\* integrity of the trust record

\* consistency of execution

\* completeness of participating artifacts

\* successful workflow completion



Verification produces an immutable Verification artifact.



\---



\# Receipt



Every completed workflow generates a Receipt.



Typical contents include:



\* Receipt identifier

\* Execution identifier

\* Trust Record hash

\* Digital signature

\* Timestamp



Receipts enable independent verification of the complete multi-agent workflow.



\---



\# Expected Output



A successful execution produces output similar to:



```text

Parmana Multi-Agent Workflow



Organization     : Acme AI Operations

Workflow         : HANDLE\_CUSTOMER\_REQUEST



Agents



Planner Agent    : Workflow generated

Research Agent   : Customer history retrieved

Execution Agent  : Support response prepared



Governance



Policy           : multi-agent-governance-policy

Decision         : APPROVED



Verification



Status           : VERIFIED



Multi-agent workflow completed with a single verifiable execution trust chain.

```



\---



\# Parmana's Role



Parmana \*\*does not\*\*:



\* orchestrate agents

\* replace agent frameworks

\* schedule tasks

\* perform reasoning

\* manage prompts

\* replace LLMs



Parmana \*\*does\*\*:



\* record authority

\* record authorization

\* record shared intent

\* evaluate governance policies

\* record execution

\* preserve execution evidence

\* generate receipts

\* enable replay

\* enable verification

\* support auditing



\---



\# Production Deployment



Parmana integrates with existing multi-agent platforms such as:



\* enterprise AI orchestration systems

\* agent frameworks

\* workflow engines

\* enterprise service buses

\* policy engines

\* observability platforms

\* governance systems



Parmana complements these systems by providing execution trust rather than replacing orchestration.



\---



\# Best Practices



\* Use one Business Transaction for each coordinated workflow.

\* Require explicit Policy References.

\* Capture evidence from every participating agent.

\* Preserve execution order where relevant.

\* Verify every completed workflow.

\* Archive Execution Trust Records.



\---



\# Common Pitfalls



Avoid these misconceptions:



\* Parmana is not an agent framework.

\* Parmana is not an orchestrator.

\* Parmana does not coordinate agent communication.

\* Parmana governs execution rather than agent behavior.



Keeping these responsibilities separate simplifies system design and improves governance.



\---



\# Real-World Applications



This execution trust model applies to:



\* Enterprise copilots

\* Autonomous software engineering

\* Customer support platforms

\* Supply chain optimization

\* Financial operations

\* Healthcare coordination

\* Security operations centers

\* Autonomous research systems

\* Enterprise knowledge assistants



Although agent responsibilities vary, the execution trust architecture remains the same.



\---



\# Why This Matters



Modern AI systems increasingly consist of teams of specialized agents rather than a single model.



Organizations therefore need governance that spans the entire workflow instead of individual components.



Parmana provides this unified execution trust layer by treating the coordinated workflow as a single governed Business Transaction.



\---



\# Summary



Multi-agent systems introduce new governance challenges because execution is distributed across multiple autonomous components.



Parmana solves this by establishing one deterministic execution trust chain that records authorization, policy evaluation, coordinated execution, verification, and cryptographic evidence for the workflow as a whole.



This enables organizations to deploy complex AI systems while maintaining transparency, accountability, and independent verifiability.



\---



\# Related Examples



\* Example 06 — Autonomous Vehicle

\* Example 08 — Financial Transaction

\* Example 10 — Custom Policy



\---



\# Next Step



Continue with:



```text

python/docs/10\_custom\_policy.md

```



to learn how Parmana's explicit policy selection architecture guarantees deterministic governance by binding a versioned `PolicyReference` directly to every `BusinessTransaction`.



