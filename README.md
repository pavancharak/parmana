# Parmana

**The authorization layer for AI agents: every action is checked against
policy and a signed human approval before it runs, and every action that
runs leaves a signed record anyone can verify.**

[![CI](https://github.com/pavancharak/parmana/actions/workflows/ci.yml/badge.svg)](https://github.com/pavancharak/parmana/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-proprietary-lightgrey)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D24.6-brightgreen)](package.json)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/pavancharak/parmana/badge)](https://scorecard.dev/viewer/?uri=github.com/pavancharak/parmana)

> **Proprietary software evaluation only.** This repository is source-available
> for evaluation purposes. No license is granted to use, copy, modify, or
> distribute this software, in whole or in part, without a separate written
> agreement with Parmana Systems. See [LICENSE](./LICENSE). The client SDKs
> and connector SDKs are the exception: they are Apache 2.0 (see [License](#license)).

As organizations connect AI agents to real systems, the open question is
no longer whether the agent can act. It is what the agent is allowed to
do, and whether what it did can be proven afterward rather than assumed.
Parmana sits between an AI agent and the systems it calls: every
requested action is checked against an explicit policy before it runs, so
an agent can only do what it was approved to do. No agent action, reads
included, is authorized without a signed approval from a trusted person
([CLAIMS.md 2.47](docs/CLAIMS.md)). Every approved action
also produces a signed, tamper-evident record, so what happened can be
proven afterward, not just trusted. Parmana does not decide what the
agent should do. It decides, and proves, whether the agent was allowed to
do it.

## What the evidence shows

[docs/CLAIMS.md](docs/CLAIMS.md) states every technical claim at the scope
its evidence supports, cites the code and tests behind it, and keeps a list
of what is not yet true. Each point below has a section there you can
check.

The chain: **authorize -> verify -> execute -> confirm**. A Business
Transaction carries an explicit authority, authorization, and intent. A
deterministic policy evaluates it and approves or rejects. An approved
transaction executes through a gateway that never lets the caller hold
real credentials directly. The result is signed into an append-only
Execution Trust Record, independently verifiable without trusting
Parmana's own runtime or database.

What has been demonstrated:

- **The full test suite runs on every commit and pull request** (typecheck, lint, format,
  every test, build and the runnable examples; the pre commit hook and CI both run it). Suites
  that need live credentials or a database skip cleanly when none are configured.
- A live, reproducible execution authorization bypass was found and fixed the same day:
  policy evaluation signals are now bound to the executed Intent before any rule evaluates
  (`Policy.boundSignals` + `SignalIntentBinder`), closing the gap where a caller could declare
  a small, fully verified action while `intent` executed something else. See
  [docs/VERIFICATION-GAPS.md](docs/VERIFICATION-GAPS.md) G-24 for the full incident, including
  the proof of concept figures, and what is still open.
- **A real external system**: HubSpot deal stage and amount updates, authorized by policy and
  executed through the signed gateway pipeline against HubSpot's production API, including a
  non-destructive read, change and revert on a real account
  ([CLAIMS.md 3.10](docs/CLAIMS.md)).
- Assessed at **Technology Readiness Level 6** (prototype demonstrated in a relevant
  environment) on the strength of the point above
  ([CLAIMS.md, Maturity Assessment](docs/CLAIMS.md)). An earlier deployment briefly reached
  TRL 7 on Razorpay evidence before that connector was removed on 2026-08-12; the Maturity
  Assessment has the history.
- **An internal source code review of the authorization path**: four passes traced the
  execution path for every capability, whatever kind of caller requests it (AI agent, person
  or other system), to check whether any action can run without authorization. The fourth
  pass found none for the capabilities registered in production, with the caveats stated
  alongside the result ([CLAIMS.md 2.25](docs/CLAIMS.md)). These were internal reviews, not
  an independent audit; the
  [Audit guide](https://docs.parmanasystems.com/evaluation/audit-guide) is the starting
  point for one.

## Architecture

```
Authority --> Authorization --> Intent --> Business Transaction
                                                  |
                                                  v
                                          Policy Engine (deterministic)
                                                  |
                                                  v
                                              Decision
                                                  |
                                                  v
                                          Execution Gateway
                                     (credentials never touch the caller)
                                                  |
                                                  v
                                        Connector -> real system
                                                  |
                                                  v
                              Execution Trust Record (signed, append-only)
                                                  |
                                                  v
                                Verification  <-->  Settlement Confirmation
```

| Package                        | Role                                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `@parmana/api`                 | REST API: `/execute`, `/verification`, webhooks, caller authentication                                         |
| `@parmana/runtime`             | Orchestrates a Business Transaction through policy, execution, and evidence                                    |
| `@parmana/policy`              | Deterministic policy evaluation, sequential rules, first-match semantics                                       |
| `@parmana/execution-gateway`   | The sole boundary that releases an approved request to a connector                                             |
| `@parmana/execution-control`   | Credential-isolating, single-use execution release                                                             |
| `@parmana/connector-sdk`       | Connector authoring contract: capability definitions, schemas, and the Connector/CredentialProvider interfaces |
| `@parmana/envelope-verifier`   | Verifies a Parmana authorization independently, no trust in Parmana's runtime or database required             |
| `@parmana/crypto`              | Signing and verification, Ed25519 by default, ML-DSA-65 (post-quantum) configurable                            |
| `@parmana/approval`            | Verifies signed approvals issued by a business authority, independent of the caller and of Parmana's runtime   |
| `@parmana/capability-registry` | Binds each capability to the policy that governs it and refuses a request that names another                   |
| `@parmana/execution-system`    | The interface Parmana forwards approved requests through, with an HTTP implementation                          |
| `@parmana/connector-*`         | Connectors: HubSpot, GitHub, Slack and Paytm                                                                   |
| `@parmana/governance-ui`       | Internal UI to propose and review policy changes; approval stays on the approver's machine                     |
| `@parmana/replay`              | Deterministic reconstruction of a past policy decision                                                         |
| `@parmana/storage`             | Append-only persistence, in-memory or Supabase-backed                                                          |
| `@parmana/shared`              | Domain model and configuration shared across every package                                                     |

Key properties: fail-closed configuration (a misconfigured process refuses
to start rather than degrade silently), credential isolation (a connector
never receives long-lived credentials, only a single-use session), exactly-once
consumption of every authorization and webhook event, append-only signed
evidence, and both classical (Ed25519) and post-quantum (ML-DSA-65)
signing.

## Getting started

Evaluating Parmana? [EVALUATION.md](EVALUATION.md) is the step by step guide: requirements,
what to run, and what to expect. The short version, on Node.js 24.6 or later with no `.env`
or credentials:

```bash
npm ci
npm run build
npm test
npm run examples
```

To see the full chain run against a local mock connector, no network
access or credentials required:

```bash
npx tsx examples/tutorials/60-end-to-end-enterprise-execution/run.ts
```

This walks through the full pipeline: policy evaluation, signed
authorization, envelope verification, request-bound attestation, session
credential issuance, connector execution, credential destruction, and the
signed audit/trust record.

For a real deployment, see
[Deploy to production](https://docs.parmanasystems.com/deployment/production)
(source: `docs/site/deployment/production.mdx`): required configuration,
fail closed startup validation, and how to confirm a deployment. To run it
on your own infrastructure with Docker Compose, see
[Self hosted](https://docs.parmanasystems.com/self-hosted/overview).

To call the live hosted instance directly (authentication, the request
shape, the deployed policies, and offline verification), see
[Live API and demos](https://docs.parmanasystems.com/guides/live-api-and-demos).

A further tier of integration tests exercises HubSpot's real API and is
opt-in, skipped by default so `npm test` never needs live credentials.
The env vars involved (names only, see the test files for what each
gates): `ALLOW_LIVE_HUBSPOT`, `TEST_HUBSPOT_PRIVATE_APP_TOKEN`,
`TEST_HUBSPOT_DEAL_ID`, and separately `ALLOW_LIVE_SUPABASE` for the
Supabase-gated storage suite.

To measure throughput and latency for `POST /execute` (real policy
evaluation, Ed25519 signing and connector execution, at configurable
concurrency against an in memory instance with caller authentication
disabled; the script's header comment has the exact scope):

```bash
npm run loadtest -- --connections 20 --duration 15
```

## Status and scope

Assessed at TRL 6 on the evidence in [docs/CLAIMS.md](docs/CLAIMS.md).
Explicitly not claimed: sustained volume, load-bearing traffic, high
availability, or multi-tenant production operation. The claims file also
tracks what has no implementation yet, every connector beyond HubSpot,
GitHub, and Paytm among them. Adding a new connector is a bootstrap source change
today, not a runtime configuration option. See
[docs/connectors/BUILDING_A_CONNECTOR.md](docs/connectors/BUILDING_A_CONNECTOR.md).

We're looking for a small number of design partners to run Parmana
against a real integration under real constraints. If that's you, or
you're evaluating Parmana for a role, reach out: **founder@parmanasystems.com**.

## Support

- Email: [founder@parmanasystems.com](mailto:founder@parmanasystems.com)
- Website: [parmanasystems.com](https://parmanasystems.com/)
- Documentation: [docs.parmanasystems.com](https://docs.parmanasystems.com)
- Issues: [github.com/pavancharak/parmana/issues](https://github.com/pavancharak/parmana/issues)

## License

Source-available for evaluation only. See [LICENSE](./LICENSE). No
license is granted to use, copy, modify, distribute, or create
derivative works from this repository except as expressly permitted in a
separate written agreement with Parmana Systems.

The exceptions are the SDKs, which are licensed under the Apache License 2.0:
the client SDKs in [typescript/](typescript/) and [python/](python/) (published
as `@parmana/sdk` and `parmana`), and the connector SDKs in
[packages/connector-sdk/](packages/connector-sdk/) and
[python-connector-sdk/](python-connector-sdk/). See the LICENSE file in each
directory.

Copyright (c) 2026 Parmana Systems Private Limited. "Parmana" is a trademark of Parmana Systems
Private Limited. See [NOTICE](./NOTICE).

## More documentation

**New here? Start with [The Parmana Handbook](https://docs.parmanasystems.com/handbook/overview)**:
every capability this codebase has, explained from the source, in 23 chapters
(source: `docs/site/handbook/`, also as a
[downloadable PDF](https://docs.parmanasystems.com/handbook/download)).

[docs/README.md](docs/README.md) indexes the rest of the repository documentation: the
claims register, the gap log, what is left to do, and the architecture decisions.

Connecting an external agent? Start with
[docs/connectors/CONNECTING_AN_AGENT.md](docs/connectors/CONNECTING_AN_AGENT.md)
(what's required and why, a step-by-step walkthrough, and every response/error
cited to source).

Adding a connector? Start with
[docs/architecture/CONNECTOR_ISOLATION.md](docs/architecture/CONNECTOR_ISOLATION.md)
(how credential isolation works) and
[docs/connectors/BUILDING_A_CONNECTOR.md](docs/connectors/BUILDING_A_CONNECTOR.md)
(the concrete steps, using the real HubSpot/GitHub connectors as reference).
