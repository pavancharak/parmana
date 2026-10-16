# Example: a pull request merge that GitHub must confirm

`policy.json` is `github-pr-merge-sourced` 1.0.0. It is an example, not a shipped policy: nothing binds it to
`github:pr-merge`, so production merges still use `github-pr-approval` 1.1.0.

## What it changes

`github-pr-approval` 1.1.0 takes four readiness facts from the caller (`statusChecksPassed`,
`requiredReviewsCompleted`, `branchProtected`, `riskScore`). A caller can refuse a merge with them but cannot
authorize one. The gap is that nothing checks them against GitHub (`docs/BUSINESS-VALIDATION-COVERAGE.md`, G-51).

This policy asks GitHub instead:

| Fact                       | Source   | Claim                          | Subject  | Max age |
| -------------------------- | -------- | ------------------------------ | -------- | ------- |
| `statusChecksPassed`       | `github` | `pr.status-checks-passed`      | `target` | 60 s    |
| `requiredReviewsCompleted` | `github` | `pr.required-reviews-complete` | `target` | 60 s    |
| `branchProtected`          | `github` | `pr.base-branch-protected`     | `target` | 300 s   |

`repositoryAuthorized` stays caller declared. It is an operator allowlist of repositories this deployment may merge
into, not a GitHub fact, so it belongs in an allowlist the server holds (the way the Slack channel check works).
It can only refuse here.

The signed approval (`mergeApproved`, for the target) still authorizes the merge. The sourced facts must all hold too.

## Why the source is not built here

The `github` source is an HTTPS endpoint an operator registers (`typescript/examples/08-business-signal-source.ts`
is the protocol). It has to read the pull request from the GitHub API with a token scoped to that repository. That
needs a real token, so this example stops at the policy. Until a `github` source is registered, Parmana refuses every
request under this policy as `SOURCE_UNAVAILABLE`. That is the fail-closed behaviour the RFC requires.

## Check it

```bash
npx vitest run examples/business-validation
```

The test loads the policy through `PolicyValidator`, then checks the approve path and each refusal against
`PolicyEngine`, using trusted values supplied directly.

## To use it in production

1. Register a `github` source through maker checker (`POST /business-signal-sources/changes`), with the HTTPS endpoint
   and an Ed25519 key.
2. Propose the policy as a new version of `github-pr-approval` through policy governance (the API, with maker checker
   and step up). Repository files under `policies/` are checked against approval records in CI, so a direct file edit
   is refused.
3. Bind `github:pr-merge` to that version through the same governance path. Test the change in a live check first, as
   `examples/live-checks/business-signal-source` does.
