# Business validation examples

Example policies that ask the system owning a fact, instead of trusting the caller, for each gap in
[BUSINESS-VALIDATION-COVERAGE.md](../../docs/BUSINESS-VALIDATION-COVERAGE.md). Each one is a policy file with a README
and a test. None is bound to a capability, so none changes what Parmana decides in production.

| Example                                                        | Policy                          | Facts asked of a source                                | Source needed                  |
| -------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------ | ------------------------------ |
| [`github-pr-merge`](github-pr-merge/README.md)                 | `github-pr-merge-sourced` 1.0.0 | checks passed, reviews complete, base branch protected | `github`                       |
| [`customer-refund-sourced`](customer-refund-sourced/README.md) | `customer-refund-sourced` 1.0.0 | refund eligible, fraud check passed                    | `order-system`, `fraud-system` |

Why they are under `examples/` and not `policies/`: `policies/{name}/{version}/policy.json` is checked in CI against
a maker checker approval record, so a new file there is refused until a person approves it through the API. The
examples keep the same shape, so the change to make one live is the governance path, not a rewrite.

Every sourced fact is refused until its source is registered, as `SOURCE_UNAVAILABLE`. That is the intended state
until an operator connects the system.

Slack `contentApproved` has no example. No business system owns it. It needs a content review system or a person, and
the decision belongs to the operator.

## Run the tests

```bash
npx vitest run examples/business-validation
```
