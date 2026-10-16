# Business validation coverage, by action

Status: current as of 2026-10-16, from the code and policies in this repository.

This is a map, not a design. For each production capability it says which facts the policy relies on, whether
anything checks each fact against the system that owns it, and which system that is. It is the working list for
choosing which business systems to connect first. The mechanism is in [RFC-0023](rfcs/RFC-0023-Business-Validation.md).

Read with [VERIFICATION-GAPS.md](VERIFICATION-GAPS.md) G-51, G-76, G-92, G-93 and G-94.

## How a fact is checked today

A policy fact is one of four kinds:

| Kind                | What decides it                                                                                   | Can it authorize an action?                 |
| ------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Bound               | The request's own field (`boundSignals`), so the policy reads the value the gateway releases      | Yes, as a limit or a match                  |
| Approval            | A signed human approval for that object (`approvalSignals`), verified by `ApprovalSignalVerifier` | Yes; this is the only thing that authorizes |
| Verified by Parmana | An in-process verifier that asks a system or a server-held list (`SignalStateVerifier`)           | Yes, when the check passes                  |
| Caller-declared     | The agent or caller says it is true (`unboundSignalReasons`, "Declared by the caller")            | No. It can only make a rule refuse          |

Two verifiers run today, both wired in `packages/api/src/application.ts`:

- **HubSpot deal state**: `HubSpotSignalStateVerifier` fetches the deal from HubSpot before a
  `hubspot:deal-update` is decided and derives the current stage and amount facts from it.
- **Slack channel allowlist**: `createSlackChannelSignalVerifier` checks `channelAuthorized` against
  `SLACK_ALLOWED_CHANNEL_IDS`. This is a list Parmana holds, not a check against Slack.

RFC-0023 adds a third route, `signalSources`, which asks a registered business system with a signed query. No
shipped policy declares a source, so it is not in use for any action yet.

## Production capabilities

These six capabilities are bound to a policy in `CANONICAL_CAPABILITY_POLICY_BINDINGS`
(`packages/capability-registry/src/CapabilityPolicyBinding.ts`).

### `hubspot:deal-update`: policy `hubspot-deal-update` 1.1.0

| Fact                                                                                              | Kind                | Checked against                    | Status                                             |
| ------------------------------------------------------------------------------------------------- | ------------------- | ---------------------------------- | -------------------------------------------------- |
| `proposedDealStage` (`parameters.dealstage`), `proposedAmount` (`parameters.amount`)              | Bound               | The request                        | Checked                                            |
| `currentDealStage`, `dealStageChangeRequested`, `dealStageTransitionAllowed`, amount change facts | Verified by Parmana | HubSpot, live deal fetch           | Checked. Covered by `HUBSPOT_VERIFIED_SIGNAL_KEYS` |
| `dealUpdateApproved`                                                                              | Approval            | Signed human approval for the deal | Checked                                            |

**Owner:** HubSpot. **Gap:** none for the listed facts. The transition graph is Parmana's own table, not HubSpot's.

### `hubspot:deal-fetch`: policy `hubspot-deal-read` 1.0.0

No facts. Reads need `readApproved`, a signed approval for the deal.

### `github:pr-merge`: policy `github-pr-approval` 1.1.0

| Fact                                                                | Kind            | Checked against                      | Status                                      |
| ------------------------------------------------------------------- | --------------- | ------------------------------------ | ------------------------------------------- |
| `repositoryAuthorized`                                              | Caller-declared | Nothing                              | Not checked. Can only refuse                |
| `requiredReviewsCompleted`, `statusChecksPassed`, `branchProtected` | Caller-declared | Nothing                              | Not checked against GitHub. Can only refuse |
| `riskScore`                                                         | Caller-declared | Nothing                              | Not checked. Can only refuse                |
| `mergeApproved`                                                     | Approval        | Signed approval for the pull request | Checked                                     |

**Owner:** GitHub (reviews, required checks, branch protection, pull request state). The repository allowlist has
no owner in the repo yet. **Gap:** no GitHub verifier exists. Until one does, a signed approver must read GitHub
themselves before approving, since the approval is what authorizes the merge.

### `github:pr-fetch`: policy `github-pr-read` 1.1.0

No facts. Reads need `readApproved`.

### `paytm:refund`: policy `customer-refund` 1.2.0

| Fact                                             | Kind            | Checked against                   | Status                                               |
| ------------------------------------------------ | --------------- | --------------------------------- | ---------------------------------------------------- |
| `refundAmount` (`parameters.amount`)             | Bound           | The request, and the gateway hash | Checked                                              |
| `managerApproved` (for the order and the amount) | Approval        | Signed manager approval           | Checked; up to 100000 per refund, above that refused |
| `refundEligible`                                 | Caller-declared | Nothing                           | Not checked against the order. Can only refuse       |
| `fraudCheckPassed`                               | Caller-declared | Nothing                           | Not checked against a fraud system. Can only refuse  |

**Owner:** the merchant's order system for eligibility (RFC-0023 open question 1), and the fraud system for
`fraudCheckPassed`. Paytm does not own either. **Gap:** this is the case RFC-0023 was written for. Both facts
could be sources once the owning systems are named.

### `slack:post-message`: policy `slack-post-message` 1.1.0

| Fact                   | Kind                | Checked against                                 | Status                                                   |
| ---------------------- | ------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| `channelId` (`target`) | Bound               | The request                                     | Checked                                                  |
| `channelAuthorized`    | Verified by Parmana | `SLACK_ALLOWED_CHANNEL_IDS`, a server-held list | Checked against Parmana's list, not against Slack (G-76) |
| `contentApproved`      | Caller-declared     | Nothing                                         | Not checked. Can only refuse                             |
| `postApproved`         | Approval            | Signed approval for the channel                 | Checked                                                  |

**Owner:** for `channelAuthorized`, Slack (channel membership and visibility); today the server's list stands in for
it. For `contentApproved`, there is no system in the repository. It would be a content-review or data-loss-prevention
system, or a person. **Gap:** `contentApproved` is open (G-51, G-76).

## Templates, not bound to a built-in capability

These policies are in `policies/` but no built-in capability binds them. An external connector can bind one by
registration (ADR-0013), so they are real when a deployment uses them. Their facts are the same kinds as above.

| Policy                        | Caller-declared or unverified facts                                                              | Likely owner                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `vendor-payment` 2.1.0        | `vendorVerified`, `invoiceVerified`, `sufficientFunds`, `riskScore`                              | Vendor master, AP or ERP, bank                     |
| `agent-vendor-payment` 1.1.0  | `vendorAllowed`, `withinCredentialLimit`, `withinVelocityLimit`                                  | Vendor master; Parmana's own limit records         |
| `expense-reimbursement` 1.1.0 | `employeeVerified`, `receiptAttached`, `categoryApproved`                                        | HR or identity system; expense system              |
| `database-change` 3.1.0       | `changeApproved`, `migrationValidated`, `maintenanceWindow`, `riskScore`                         | Change-management system; CI                       |
| `production-deployment` 1.1.0 | `deploymentApproved`, `changeVerified`, `rollbackReady`, `maintenanceWindow`, `riskScore`        | Change-management system; CI and deploy system     |
| `llm-tool-call` 1.1.0         | `toolAllowed`, `resourceAuthorized`, `executionEnvironment`, `riskScore`                         | Tool registry; resource entitlements               |
| `rag-document-access` 1.1.0   | `requesterAuthenticated`, `requesterAuthorized`, `documentAccessible`, `classificationPermitted` | Identity provider; document system; classification |
| `api-key-issuance` 1.1.0      | `requesterVerified`, `scopeAuthorized`, `riskScore`                                              | Identity provider; entitlement system              |
| `access-control` 1.1.0        | `userAuthenticated`, `userAuthorized`, `mfaVerified`, `deviceTrusted`, `sessionRiskScore`        | Identity provider; MDM; risk engine                |
| `connector-capability` 1.1.0  | `capability` (enforced by the capability registry, not a fact)                                   | Capability registry (in repo)                      |

## Facts, grouped by the system that owns them

| Owner system                       | Facts                                                                                               | Covered today                     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------- |
| HubSpot                            | Deal stage, amount change (`hubspot:deal-update`)                                                   | Yes, in-process verifier          |
| Slack                              | Channel authorization                                                                               | Partly: Parmana's list, not Slack |
| GitHub                             | Repository authorization, reviews, status checks, branch protection, pull request state             | No                                |
| Merchant order system              | Refund eligibility (`refundEligible`)                                                               | No                                |
| Fraud system                       | `fraudCheckPassed`                                                                                  | No                                |
| Content review or DLP              | `contentApproved`                                                                                   | No                                |
| Identity provider and entitlements | `requesterAuthenticated`, `requesterAuthorized`, `userAuthorized`, `mfaVerified`, `scopeAuthorized` | No (templates)                    |
| Vendor master, AP or ERP, bank     | `vendorVerified`, `invoiceVerified`, `sufficientFunds`                                              | No (templates)                    |
| Change-management and CI/CD        | `changeApproved`, `deploymentApproved`, `changeVerified`, `migrationValidated`, `rollbackReady`     | No (templates)                    |

## What this means for the next step

- Each row marked "No" is a fact an agent can declare that no system checks. A declared fact can only refuse, so the
  exposure is that an approver may rely on it. It is not that an agent can authorize an action with it alone.
- Two routes close a row: an RFC-0023 source (`signalSources`, asked with a signed query), or an in-process verifier
  like the HubSpot and Slack ones. The HubSpot verifier is the model for a system whose API Parmana can already call.
- Cumulative grant limits (G-93) apply to every capability, not only refunds. The grant is keyed by capability.
- The order of work is a choice for the operator. Within a row, the cost is the connection, not the policy.

## Keeping this current

Regenerate the lists above when a policy version, a capability binding or a verifier changes. The source files are
`policies/*/*/policy.json`, `CANONICAL_CAPABILITY_POLICY_BINDINGS` and `application.ts`. A change to any of them that
alters a row here is a change to this document.
