# Mutation testing results

`npm run mutation -- <package>` (see [CONTRIBUTING.md](../CONTRIBUTING.md#mutation-testing))
makes small deliberate changes to a package's source, one at a time, and runs that package's
tests against each. A change the tests catch is **caught**; one they miss **survived**. The score
is the share caught.

This file records the first run on the five security-critical packages, what the surviving
changes showed, and what was done about them.

## How to read the scores

- **Only the package's own tests count.** Other packages' tests (the API's integration tests,
  for example) import the built package and cannot see Stryker's changes, so the real protection
  is higher than the score.
- **Some survivors change nothing observable.** An "equivalent" change, such as removing a check
  that a later check makes redundant, cannot be caught by any test. These are listed as such, not
  forced with artificial tests.
- **A low score in code that decides nothing is less urgent** than a survivor in a check that
  refuses an action. The write-up below separates the two.

## Scores

| Package             | First run | Caught      | After the fixes |
| ------------------- | --------- | ----------- | --------------- |
| `envelope-verifier` | 89.7%     | 104 of 116  | to be re-run    |
| `approval`          | 77.7%     | 380 of 489  | to be re-run    |
| `policy`            | 50.3%     | 659 of 1309 | to be re-run    |
| `execution-gateway` | running   |             |                 |
| `crypto`            | not run   |             |                 |

First run: 2026-10-05.

## What the survivors showed, and what changed

### envelope-verifier

12 survived. None let an invalid authorization through.

| Gap                                                                                 | Matters for security                  | Done                                                            |
| ----------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------- |
| A key expiring at exactly now, and a key with a future expiry, were untested        | Boundary of key expiry                | Tested: rejected at the instant, accepted a millisecond earlier |
| The maximum lifetime (`maxTtlSeconds`) boundary was untested                        | Boundary of authorization lifetime    | Tested: inclusive at the limit, refused one second over         |
| The nonce store's purge boundary was untested                                       | Memory housekeeping only              | Tested                                                          |
| A request with no body at all was untested                                          | Robustness                            | Tested: 401                                                     |
| `keyValid`, `versionSupported` and `notExpired` forced to pass when no key resolves | No: the signature check already fails | Equivalent, left                                                |

### approval

109 survived. The main gap was in the scope comparisons that bound what an approval covers.

| Gap                                                                                                                                                            | Matters for security                                                          | Done                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `ApprovalScopeEvaluator` (45.7%): only `eq` and `lte` were tested; `gte`, `lt`, `gt`, `between`, the boundaries and the refusal of non-number amounts were not | Yes: a policy using an untested comparator would rely on untested code        | Every comparator tested below, at and above its bound; non-numbers, malformed ranges and unknown comparators refused |
| `SignedApprovalGuard`: most field checks were never given a value of the wrong kind, and `null` was never tried where an object is required                    | Backup only: the signature check would still refuse                           | Each field tested with a wrong value                                                                                 |
| `ApprovalSignalVerifier`: paths outside `parameters`, paths through a non-object, non-finite amounts and resource ids                                          | Yes, as backup to JSON (which cannot carry Infinity)                          | Tested, with the exact refusal reason                                                                                |
| Labels and sort order in messages                                                                                                                              | No                                                                            | Left                                                                                                                 |
| Removing `keys.length === 0` in path resolution                                                                                                                | No: a bare `parameters` path resolves to an object, refused as missing anyway | Equivalent, left                                                                                                     |

### policy

650 survived, most of them in code that decides nothing at request time.

| Gap                                                                                                                                               | Matters for security                                                                             | Done                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `OperatorEvaluator` (58.9%): boundaries, and what each operator does with a value of the wrong type, were untested                                | Yes: every rule condition is decided here                                                        | 44 tests: every operator at its boundary and against wrong types                          |
| `PolicyEngine` (63.8%, one test in this package): `any` was untested, as were the no-match result, first match, unknown actions and missing facts | Yes                                                                                              | 12 tests                                                                                  |
| `CompositeSignalStateVerifier` (0%): a version that ignored every verifier's refusals passed                                                      | Yes                                                                                              | 4 tests                                                                                   |
| `FilePolicyRepository`: the character check was only tested behind the resolved-path check                                                        | Backup layer of the path traversal guard                                                         | Names with a slash or a bare dot that stay inside the directory are now refused in a test |
| `SignalIntentBinder`: a bound path through a string or null                                                                                       | Yes                                                                                              | Tested                                                                                    |
| `PolicyValidator` (47.4%, 409 survivors): authoring-time validation of policy files                                                               | Indirect: catches mistakes before approval, decides nothing at request time                      | Left for a later pass                                                                     |
| `SupabasePolicyRepository`, `PolicyRegistry`, error classes (0 to 50%)                                                                            | No unit tests in this package; covered by integration tests elsewhere, or unused at request time | Left                                                                                      |

**Finding, not yet changed:** signal types are not checked before rules run. Each policy
declares them in `signalsSchema`, but that is only used to tell an agent what to send. A numeric
signal sent as text (`"150000"`) makes every numeric operator false, so a rule written as
"reject if amount gt X, otherwise approve" would not reject it. The shipped policies tested
(`customer-refund` 1.2.0) still refuse such a request through a later rule and the approval
check, and no bypass was found. The proposed fix is to refuse a request whose signals do not match
the policy's declared types before any rule runs; it changes server behavior and is tracked
separately.

### execution-gateway

Running.

### crypto

Not run yet.
