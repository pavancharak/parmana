# RFC-0023 — Business validation: an agent's proposal is never a business fact

Status: Phase 1 implemented

Author: Pavan Dev Singh Charak (requirement); implementation session

Created: 2026-10-10

Updated: 2026-10-10

---

# Summary

An agent proposes an action and the facts it rests on. Today a policy evaluates those facts as the
caller sent them. A signed human approval is what authorizes (2.47), and caller facts can only refuse
(G-80). No business system confirms that the facts are true. This RFC adds a business validation
layer between authority and execution:

1. **Authority**: may this caller perform this kind of action at all?
2. **Business validity**: is this exact action valid for this exact business object, according to
   the system that owns the facts?

Execution proceeds only when both hold. Every decision records the two answers, and for a refusal the
execution answer, as separate statuses.

# The rule

A fact the agent proposed is never treated as a business fact. A policy names, per fact, the source
that owns it. Parmana asks that source itself, about the business object read from the Intent, and
records the answer as a **Trusted Signal**. The policy is evaluated on the trusted value. The agent's
own value is only compared with it, and a different value refuses the request.

This is not "proposal, then signature, then trusted signal". A signature over the agent's claim
proves who made the claim, not that it is true.

# Flow

```
Agent proposes action and facts
  -> normalize (SignalIntentBinder: the facts must describe the Intent)
  -> AUTHORITY (governance verification, capability/policy binding; caller scope at the API)
       not AUTHORIZED -> refuse; no business system is asked
  -> BUSINESS VALIDATION (TrustedSignalResolver)
       for each signalSources entry: ask the source -> Trusted Signal, or a failure status
       compare the agent's proposed value, if any
       not VALID -> refuse
  -> POLICY, evaluated on the trusted values
  -> signed approval check, authorization, release, signed record
```

# Statuses

| Answer              | Statuses                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Authority           | `AUTHORIZED`, `NOT_AUTHORIZED`, `AUTHORITY_UNCLEAR`, `AUTHORITY_EXPIRED`                                            |
| Business validation | `VALID`, `INVALID`, `MISSING_DATA`, `CONFLICTING_DATA`, `SOURCE_UNAVAILABLE`, `VALIDATION_EXPIRED`, `NOT_EVALUATED` |
| Execution           | `EXECUTED`, `NOT_EXECUTED`, `EXECUTION_FAILED`, `EXECUTION_UNKNOWN`                                                 |

- `AUTHORIZED` means the action type may be decided. It does not mean this action is valid or was
  executed.
- `NOT_EVALUATED` is added to the requested set. It means validation did not run: authority was not
  established, or the policy declares no sourced facts. It is never `VALID`.
- `EXECUTION_UNKNOWN` is added: a release whose outcome cannot be established, such as a connector
  timeout after the request was sent, is never reported as failed.
- No status is ever converted into another. Any validation status other than `VALID` refuses the
  request, except `NOT_EVALUATED` under a policy that declares no sources. Those policies behave as
  before this RFC and still need a signed approval to approve.

# Trusted Signal

```json
{
  "signalId": "...",
  "signalKey": "refundEligible",
  "source": "orders-system",
  "sourceIdentity": "orders.example.internal",
  "claim": "refund.eligible",
  "subject": "123",
  "subjectPath": "parameters.orderId",
  "observedValue": true,
  "observedAt": "...",
  "validUntil": "...",
  "action": "refund",
  "businessTransactionId": "...",
  "integrityProof": {
    "algorithm": "sha256",
    "digest": "...",
    "sourceProof": "..."
  },
  "verificationStatus": "VERIFIED"
}
```

`integrityProof.digest` is the SHA-256 of the canonical signal without its proof. It is signed by
Parmana as part of the Decision in the Execution Trust Record or Refusal Record. That proves what
Parmana observed, not that the source said it. `sourceProof` carries the source's own proof, such as
a response signature, verbatim, when the source has one. Verifying a source's own proof is per-source
work for later phases.

`validUntil` is the earlier of the source's own `validUntil` and `observedAt + maxAgeSeconds`
(default 300 s).

# Policy declaration

```json
"signalSources": {
  "refundEligible": {
    "source": "orders-system",
    "claim": "refund.eligible",
    "subject": "parameters.orderId",
    "maxAgeSeconds": 60
  }
}
```

`PolicyValidator` refuses a declaration that:

- no rule reads;
- names a fact that is also in `boundSignals`, `approvalSignals` or `unboundSignalReasons`;
- has a malformed source name, an empty or overlong claim, or a subject outside the Intent;
- has a `maxAgeSeconds` outside 1 to 86400.

`GET /policies/in-effect` lists the declarations as `signals.sourced`.

# Audit model

Each `Decision` carries `assessment`:

```json
{
  "authority": { "status": "AUTHORIZED", "reason": "..." },
  "businessValidation": {
    "status": "INVALID",
    "reason": "refundEligible: the request proposed true, but source \"orders-system\" reports false for 123.",
    "signals": [ ... ],
    "failures": [ ... ]
  },
  "execution": { "status": "NOT_EXECUTED", "reason": "Not executed: business validation failed." }
}
```

The Decision is inside the signed canonical form of both records, so changing any status fails
verification. Records made before this RFC have no `assessment` and still verify.

# Phases

1. **This change.** Statuses, the Trusted Signal, `signalSources`, the source port
   (`BusinessSignalSource`) with a static registry, the resolver, the runtime step, and the
   assessment on every Decision. No source is registered in the server, so a policy that declares one
   is refused as `SOURCE_UNAVAILABLE`, failing closed. No shipped policy declares one.
2. Source registry through maker checker; a generic HTTP source; HubSpot and approvals as sources.
3. Per-agent authority grants (action type, limits, expiry), making `AUTHORITY_EXPIRED` reachable.
4. Conditional execution ("execute only if still valid") through connectors, re-checking `validUntil`
   at release, and execution statuses on the Trust Record.

# Open questions

1. The source of truth for refund eligibility (the merchant's order system, not Paytm) must be named
   before `customer-refund` can declare a source.
2. Whether a sourced fact can replace the signed human approval for some actions, or always adds to
   it. Phase 1 keeps the approval requirement (2.47) unchanged.
