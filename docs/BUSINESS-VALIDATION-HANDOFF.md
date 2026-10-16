# Business validation: handoff

Status as of 2026-10-16. Use this to resume the business validation work. The detail lives in the documents linked
from each section; this file says what is done, what is left, and what needs a person.

Branch: `ccr-38909242-sqvxm0`. Commits from this session: `88ec434` (coverage map), `c007b7b` (example policies).
No pull request is open.

## 1. What the feature is

Parmana asks the system that owns a fact, not the agent, whether the fact holds before it decides an action (RFC-0023,
`docs/rfcs/RFC-0023-Business-Validation.md`). It is not limited to refunds. Built and deployed in four phases:
statuses, source registry through maker checker, authority grants, and re-checks at release. Verified in production
on 2026-10-11 with two live checks (`examples/live-checks/authority-grant`, `examples/live-checks/business-signal-source`).

## 2. Done

| Item                                                                                                        | Where                                                                     | Verified                                                               |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Coverage map: every production capability, its facts, whether each is checked, and the owner system         | `docs/BUSINESS-VALIDATION-COVERAGE.md`                                    | Read from the code and policies (policy versions, bindings, verifiers) |
| Gap records updated: G-51 says Slack `channelAuthorized` is now checked (the body text is older)            | `docs/VERIFICATION-GAPS.md` G-51                                          | Update line added; body text not rewritten                             |
| RFC-0023 section that says it covers more than refunds                                                      | `docs/rfcs/RFC-0023-Business-Validation.md`                               | Prettier                                                               |
| Remaining-work entry L.6 and current-state pointer                                                          | `docs/REMAINING-WORK.md`, `docs/CURRENT-STATE.md`                         | Prettier                                                               |
| Example policy `github-pr-merge-sourced` 1.0.0 (checks, reviews, branch protection asked of `github`)       | `examples/business-validation/github-pr-merge/`                           | 13 tests with the next row                                             |
| Example policy `customer-refund-sourced` 1.0.0 (eligibility from `order-system`, fraud from `fraud-system`) | `examples/business-validation/customer-refund-sourced/`                   | Same tests                                                             |
| Tests for both policies: validator accepts them; approve and refuse paths on `PolicyEngine`                 | `examples/business-validation/tests/business-validation-policies.test.ts` | 13 of 13 pass; typecheck passes; prettier passes                       |

Other checks run: the business validation and signal source unit tests (97 of 97 before the examples were added); the
documentation architecture tests (437 of 437); the examples plus architecture tests together (769 of 769).

Nothing in production changed. No policy under `policies/` was edited, no capability was rebound, and no source was
registered.

## 3. Facts, by state

| Fact or capability                                        | State                                                                                 |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| HubSpot deal stage and amount (`hubspot:deal-update`)     | Checked against live HubSpot by an in-process verifier. Done                          |
| Slack channel (`slack:post-message`)                      | Checked against the server's allowlist `SLACK_ALLOWED_CHANNEL_IDS`, not against Slack |
| GitHub merge facts (`github:pr-merge`)                    | Caller-declared in production. Example policy written, no source built                |
| Refund eligibility and fraud (`paytm:refund`)             | Caller-declared in production. Example policy written, no source built                |
| Slack `contentApproved`                                   | Caller-declared. No owner system in the repo; no example                              |
| Cumulative grant limits (G-93)                            | Not built. Design in RFC-0023, four open questions                                    |
| Built-in connectors re-check conditions at release (G-94) | Not built                                                                             |

## 4. Remaining work, in order

Items marked **person** need a human decision, credential or system access. The agent cannot do them.

1. **person**: name the order system and the fraud system that own refund facts (RFC-0023 open question 1,
   `docs/REMAINING-WORK.md` L.1 item 2). Until then, `order-system` and `fraud-system` in the example are placeholders.
2. **person**: decide how Slack `contentApproved` is owned: a content-review system, or a named person.
3. **person**: confirm the approach for `repositoryAuthorized` (GitHub merge). The proposal is a server-held allowlist,
   like `SLACK_ALLOWED_CHANNEL_IDS`. Not decided.
4. **Build** the `github` source endpoint. Use the protocol in `typescript/examples/08-business-signal-source.ts`.
   It needs a GitHub token scoped to the repository. An alternative is an in-process verifier, as HubSpot has, but a
   verifier is wired into the server and a source is not. Pick one and record the choice.
5. **Build** the `order-system` and `fraud-system` source endpoints, after item 1.
6. **Live check** the sourced policies, as `examples/live-checks/business-signal-source` does: register each source
   through maker checker, make one request for an approved case and each refusal, verify the record offline, then
   revoke the registrations. This needs a person to approve the registrations.
7. **person, governance**: propose new versions of `github-pr-approval` and `customer-refund` with the sourced facts,
   through `/policies` (maker checker with step up). Then bind `github:pr-merge` and `paytm:refund` to them. A direct
   edit to `policies/` is refused by CI (`scripts/verify-policy-changes-approved.ts`). This is the production change; do
   not start it without the person.
8. **Engineering, when wanted**: cumulative grant limits (G-93). The design is in RFC-0023, under "Cumulative grant
   limits". Its open questions need answers first: calendar or rolling periods, one capability or several, whether an
   approval can exceed a limit, and storage without a database. The earlier proposal (calendar periods, per caller and
   capability, approval cannot exceed a limit, Postgres counter, one capability) is not yet agreed.
9. **Engineering, when wanted**: built-in connectors (Paytm, HubSpot, GitHub, Slack) check the signed conditions at
   release (G-94).
10. **person**: the refund live check in `docs/REMAINING-WORK.md` L.1 item 1. Needs a paid Paytm order and rotated
    credentials.

## 5. Decisions already taken (do not re-derive)

- Example policies live under `examples/business-validation/`, not `policies/`. Reason: CI runs
  `verify-policy-changes-approved --full-scan` and refuses policy files without an approval record.
- Each example policy is unbound: no capability binds it, so production is unchanged.
- Sourced facts are never listed in `unboundSignalReasons` (the validator refuses that) and each approve rule keeps a
  signed approval (`PolicyValidator` requires it).
- The refund example keeps the 100000 maximum from `customer-refund` 1.2.0.
- Commit trailers keep the attribution line but leave out the model name, as the model-identity rule requires.

## 6. How to resume

```bash
cd /home/user/parmana
git fetch origin ccr-38909242-sqvxm0 && git checkout ccr-38909242-sqvxm0 && git pull

# Dependencies. The project asks for Node 24.6 or later; this sandbox had Node 22.
npm ci --ignore-scripts
npm run build          # builds the workspace packages the tests import, and regenerates the OpenAPI bundle

# The checks from this session
npx vitest run examples/business-validation
npx vitest run packages/runtime/tests/unit/business-validation.test.ts packages/runtime/tests/unit/trusted-signal-resolver.test.ts packages/runtime/tests/unit/authority-grants-runtime.test.ts packages/policy/tests/unit/PolicyValidator.test.ts packages/api/tests/unit/http-business-signal-source.test.ts
npx vitest run tests/architecture
npx prettier --check docs examples/business-validation
```

Notes:

- Without `npm run build`, the workspace imports (`@parmana/crypto`, `@parmana/shared`) fail to resolve. This was the
  only failure in the first run, not a test failure.
- `npm ci --ignore-scripts` skips the `prepare` hook that sets the git hooks path. Run `git config core.hooksPath scripts/git-hooks`
  if you commit from this checkout.
- Do not run `npm run build` expecting it to commit changes to `openapi/` or `docs/site/`. It regenerates them; in this
  session the regenerated files matched the committed ones and the working tree stayed clean.

## 7. Known stale or open records

- `docs/VERIFICATION-GAPS.md` G-51: the body still says only HubSpot has a verifier. The update line is below it. The
  body was not rewritten.
- `docs/CLAIMS.md` 2.53 to 2.56 describe the four phases. This session added no claim. The coverage map is not yet a
  claim, and any statement in CLAIMS about what is checked should be checked against the coverage map first.
- The example tests are picked up by vitest's default glob (`**/tests/**/*.test.ts`). They were not added to
  `scripts/run-examples.ts`, which runs only the listed examples.
