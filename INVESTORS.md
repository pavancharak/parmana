# Parmana — Investor Overview

*Last updated 2026-09-13. Every factual claim below cites the code, test, or document
that backs it, in keeping with the same evidence discipline documented in
[docs/CLAIMS.md](docs/CLAIMS.md) and described in
[parmana-founder-case-study.md](parmana-founder-case-study.md). Bracketed items are
commercial terms for the founder to set before this document is sent — nothing else
here is a placeholder.*

## The one-line version

**Human Authority Infrastructure.** Parmana is the authorization and evidence layer
that sits between an AI agent and the real systems it acts on: it decides whether a
requested action is allowed before it runs, and proves what actually happened
afterward — independent of whether the agent that requested it was trustworthy. The
authority to decide always originates from the organization, never from the AI's own
confidence ([docs/01-concepts/HUMAN_AUTHORITY.md](docs/01-concepts/HUMAN_AUTHORITY.md)).

## The problem

Enterprises are wiring AI agents into systems that move money, change customer
records, and trigger operational workflows. The open question is no longer whether an
agent *can* act — it's what stops it from acting outside its mandate, and whether that
can be proven after the fact rather than assumed. Existing tooling can usually answer
*who approved an action* and *when*. It generally cannot answer, with independently
verifiable evidence, *what was actually executed*, *whether it matched what was
approved*, and *whether the outcome can be proven without trusting the vendor's own
database*. That gap is what keeps regulated enterprises from switching on AI agents
for anything that touches money or compliance-sensitive systems.

## The market

Agentic AI deployment and the governance layer underneath it are both moving fast:

- The global agentic AI market is estimated at **$19.33B in 2026, growing to $205.88B
  by 2033** (40.2% CAGR) — [marketsandmarkets.com](https://www.marketsandmarkets.com/Market-Reports/agentic-ai-market-208190735.html).
- The enterprise segment specifically is projected to grow from **$5.3B (2026) to
  $24.5B (2030)** at a 46.2% CAGR — [grandviewresearch.com](https://www.grandviewresearch.com/industry-analysis/enterprise-agentic-ai-market-report).
- Agentic AI **governance** is called out separately as a 2026 market dimension in its
  own right, as autonomous agents executing real-world actions create legal liability,
  compliance, and accountability exposure that enterprises are actively spending
  against — [researchandmarkets.com](https://www.researchandmarkets.com/reports/6226159/agentic-ai-government-market-report).

Regulatory pressure is compounding the commercial pull: the EU AI Act's Article 50
transparency obligations, India's RBI FREE-AI framework for regulated financial
institutions, and NIST's AI Agent Standards Initiative are all live tracks Parmana
follows because they define what "provably authorized" will be required to mean in
the jurisdictions we're targeting first.

## The solution

Parmana enforces a four-stage chain — **authorize → verify → execute → confirm** —
between an agent's decision and the real system it acts on:

```
Authority --> Authorization --> Intent --> Business Transaction
                                                  |
                                          Policy Engine (deterministic)
                                                  |
                                              Decision
                                                  |
                                          Execution Gateway
                                     (credentials never touch the caller)
                                                  |
                                        Connector -> real system
                                                  |
                              Execution Trust Record (signed, append-only)
                                                  |
                                Verification  <-->  Settlement Confirmation
```

A deterministic policy engine — not the AI's own judgment — decides whether a
requested action is allowed. An approved action executes through a gateway that never
lets the calling agent hold real credentials. Every execution is signed into an
append-only, tamper-evident record that a third party can verify without trusting
Parmana's own runtime or database. Parmana does not decide *what* an agent should do;
it decides, and proves, whether the agent was *allowed* to do it.

## Proof, not projections

This is the section most companies at our stage cannot write in the present tense.
Parmana can, because every line below maps to a test, a commit, or a recorded run:

- **1,671 automated tests** across the workspace (1,631 passed, 38 skipped for
  credentials that simply aren't configured in CI, 0 failed) as of 2026-09-10
  ([README](README.md), [docs/VERIFICATION-GAPS.md](docs/VERIFICATION-GAPS.md) G-24).
- **A real, live execution-authorization bypass was found and fixed by the founder in
  the same session it was discovered** — policy signals are now cryptographically
  bound to the *executed* Intent, not just the declared one, closing a class of exploit
  where a caller could declare a small, fully-verified action while a different one
  actually ran. This is the strongest candidate for patent protection precisely
  because it came from a real, demonstrated exploit, not a defensive design exercise
  ([docs/VERIFICATION-GAPS.md](docs/VERIFICATION-GAPS.md) G-24,
  [docs/deep-tech/04-IP-PATENT-SUMMARY.md](docs/deep-tech/04-IP-PATENT-SUMMARY.md)).
- **Real regulated-payments validation, with real money.** A Razorpay connector was
  built, deployed, and run end-to-end on Razorpay's live-mode API — a real ₹1 refund,
  authorization to signed settlement evidence in ~64 seconds, settlement confirmation
  independently re-fetched from Razorpay's own API rather than trusted from its
  webhook alone. That evidence carried the platform to **TRL 7** before the connector
  was deliberately folded into a shared execution-gateway architecture on 2026-08-12 so
  every future connector reuses the same core rather than re-implementing it
  ([parmana-founder-case-study.md](parmana-founder-case-study.md),
  [docs/deep-tech/02-COMMERCIALIZATION-ROADMAP.md](docs/deep-tech/02-COMMERCIALIZATION-ROADMAP.md)).
- **Two live, unrelated production connectors running through that same unmodified
  core today**: HubSpot (deal-stage/amount updates, verified against HubSpot's real
  production API) and GitHub. Two independently-owned external systems running through
  one authorization core is the concrete proof that the platform is execution-agnostic
  rather than payments-specific — it no longer has to be asserted, it can be pointed at
  ([docs/CLAIMS.md](docs/CLAIMS.md) §3.10).
- Currently assessed at **TRL 6** (system/subsystem demonstration in a relevant
  environment) on that combined evidence
  ([docs/CLAIMS.md](docs/CLAIMS.md), Maturity Assessment).
- **Independently source-code-audited**, adversarially: a from-scratch review whose
  explicit brief was to *refute* Parmana's authorization claim using only code and test
  evidence. Verdict: directly validated for every capability currently registered in
  production, with caveats stated rather than smoothed over
  ([docs/architecture/strategic-positioning-validation.md](docs/architecture/strategic-positioning-validation.md)).

## Why this is hard to replicate quickly

- **Credential isolation by construction**: connectors receive a single-use,
  session-scoped credential per approved execution, never a long-lived secret —
  a compromised or misbehaving agent has nothing to spend.
- **Fail-closed by default**: a misconfigured process refuses to start rather than run
  in a degraded, silently-insecure state.
- **Exactly-once semantics** for authorizations and webhook events as a property of the
  storage design, not a best-effort heuristic.
- **Algorithm-agile signing**: Ed25519 today, ML-DSA-65 (post-quantum) configurable now
  — evidence stays verifiable across the PQC migration timelines regulators are already
  setting for financial systems.
- **A deliberate open-core IP boundary**: the mechanism (policy engine, execution
  gateway, credential isolation, signing/verification core) is proprietary,
  source-available for evaluation only; the thin client SDKs (`typescript/`, `python/`)
  are Apache-2.0, so integration is frictionless while the core stays closed
  ([docs/deep-tech/04-IP-PATENT-SUMMARY.md](docs/deep-tech/04-IP-PATENT-SUMMARY.md)).
- **Patent posture, stated honestly**: no patents filed yet. Three attorney-review
  draft specifications exist, grounded directly in shipped code, for the strongest
  candidates — signal-to-intent binding, structural capability-to-policy binding, and
  policy-change maker-checker governance (`docs/patents/`). [Filing status/timeline to
  be confirmed by founder/counsel before this claim is shown to investors as a
  near-term commitment.]

## Team

Parmana's entire technical build — architecture, the self-discovered and self-fixed
authorization bypass, the live production connector validations, and all 378 commits
since the first commit on 2026-06-25 — traces to a single author, founder Pavan Dev
Singh Charak, confirmed directly from git history rather than asserted. Prior
background: 13+ years in product roles, including at MakeMyTrip and Shaadi.com, before
founding Parmana. [Co-founder / team headcount beyond the founder, and any named
advisors with relevant cryptography, regulated-finance, or AI-safety domain expertise,
to be added here if applicable — none are currently reflected in the repository's
contribution history.]

## Go-to-market

Parmana is recruiting a small number of **design partners in Indian financial
services — payments, insurance, and capital markets** — to run a real production
process through the platform under real institutional constraints. A design partner is
treated as a co-author of the next maturity milestone, not an early customer: the
regulated-payments case is already proven with real money; what's next is proving it
*inside* an institution's own process, sign-off, and compliance requirements, which by
definition requires a partner rather than founder-only work
([parmana-founder-case-study.md](parmana-founder-case-study.md)).

## Current stage and what this raise is for

- **Pre-revenue.** No signed pilot contracts as of this writing. [Confirm current
  status before sending — if any design-partner conversations have since progressed,
  state the real status here rather than "none."]
- **Immediate roadmap** (see
  [docs/deep-tech/02-COMMERCIALIZATION-ROADMAP.md](docs/deep-tech/02-COMMERCIALIZATION-ROADMAP.md)
  for full detail): re-add a regulated-payments connector to the current architecture
  (carrying forward the proven Razorpay work rather than starting over), close the
  first design-partner deployment, file the highest-priority patent candidate, and add
  a third/fourth connector to broaden the regulated surface area.
- **[Round size, instrument, and use-of-funds breakdown to be filled in by the
  founder]** — the roadmap above is the real basis for a use-of-funds narrative
  (design-partner delivery, a second regulated connector, patent filing, and the first
  hires beyond the founder); this document intentionally does not invent a number.

## Contact

**founder@parmanasystems.com** · [parmanasystems.com](https://parmanasystems.com) ·
[github.com/pavancharak/parmana-exp](https://github.com/pavancharak/parmana-exp)
