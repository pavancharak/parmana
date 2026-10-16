# Example: a refund that the order system and the fraud system must confirm

`policy.json` is `customer-refund-sourced` 1.0.0. It is an example, not a shipped policy: nothing binds it to
`paytm:refund`, so production refunds still use `customer-refund` 1.2.0.

## What it changes

`customer-refund` 1.2.0 takes `refundEligible` and `fraudCheckPassed` from the caller. A caller can refuse a refund
with them but cannot authorize one. The gap is that no system checks them (`docs/BUSINESS-VALIDATION-COVERAGE.md`,
G-51, G-92).

This policy asks the systems that own those facts:

| Fact               | Source         | Claim                        | Subject              | Max age |
| ------------------ | -------------- | ---------------------------- | -------------------- | ------- |
| `refundEligible`   | `order-system` | `refund.eligible`            | `parameters.orderId` | 60 s    |
| `fraudCheckPassed` | `fraud-system` | `payment.fraud-check-passed` | `parameters.orderId` | 300 s   |

The amount is bound to the request (`parameters.amount`), and the manager's signed approval covers that order and
amount, as in `customer-refund` 1.2.0. The limit of 100000 is the same.

## Why the sources are not built here

Each source is an HTTPS endpoint an operator registers. They answer for the merchant's order system and the fraud
system, which are not in this repository. The protocol is in `typescript/examples/08-business-signal-source.ts`.
Until both are registered, every request under this policy is refused as `SOURCE_UNAVAILABLE`, which fails closed.

The order system is the one RFC-0023 open question 1 asks to be named before `customer-refund` can declare a source
(`docs/REMAINING-WORK.md` L.1, item 2). The name `order-system` here is a placeholder for it.

## Check it

```bash
npx vitest run examples/business-validation
```

The test loads the policy through `PolicyValidator`, then checks the approve path and each refusal against
`PolicyEngine`, using trusted values supplied directly.

## To use it in production

1. Name the order system and register it, and a fraud system, as sources through maker checker.
2. Propose the policy as a new version of `customer-refund` through policy governance, with maker checker and step up.
3. Bind `paytm:refund` to that version through the same governance path, after a live check as in
   `examples/live-checks/business-signal-source`.
