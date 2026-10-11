# Live check: a business signal source in production (not yet run)

RFC-0023 phase 2 lets an operator register any business system as a source of facts, so Parmana asks it, never the
agent (`docs/CLAIMS.md` 2.54); phase 4 carries what the decision rests on to the system that acts, as signed
`conditions` (2.56). Both are built, tested and deployed, but no source has answered a production decision
(`docs/VERIFICATION-GAPS.md` G-92). This check proves it against the real server, with a demo source and an action
that change nothing anywhere:

| #   | Request (each with a valid signed approval)                   | Required                                                                                                                                                 |
| --- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Invoice `INV-LC-PAID`, the agent declares nothing             | `APPROVED`; the record holds a Trusted Signal from `livecheck-erp` saying `true` with `sourceProofVerified: true`; the release carries it as a condition |
| 2   | Invoice `INV-LC-UNPAID`                                       | Refused by the policy; validation `VALID`: the source answered, `false`                                                                                  |
| 3   | Invoice `INV-LC-UNPAID`, the agent claims `invoicePaid: true` | Refused, `INVALID`: the source's value differs from the agent's                                                                                          |
| 4   | Invoice `INV-LC-NONE`                                         | Refused, `MISSING_DATA`: the source has no such invoice                                                                                                  |

## Status

| Date | Result      |
| ---- | ----------- |
| —    | Not run yet |

Checked locally on 2026-10-11, before any deployment: the bundle `build-endpoint.ts` makes, run as Vercel runs it,
answered Parmana's own query client (`HttpBusinessSignalSource`) with `true` for `INV-LC-PAID` and `false` for
`INV-LC-UNPAID`, both `sourceProofVerified: true`, and `not_found` for `INV-LC-NONE`.

When it has run in production: record the four transactions and their answers here, keep the record files and the two
endpoints' log lines as evidence, and update `docs/VERIFICATION-GAPS.md` G-92 and `docs/REMAINING-WORK.md` section L.

## What it uses

| Part        | What                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| The source  | `endpoint.ts`: example 08's handler answering from a fixed table, deployed as Vercel project `parmana-signal-check`                        |
| Its address | `https://parmana-signal-check.vercel.app/api/signals`, registered as source `livecheck-erp`                                                |
| Its key     | An Ed25519 key pair made for this check: the public key registered with Parmana, the private key only in Vercel's `SOURCE_PRIVATE_KEY_PEM` |
| Policy      | `policy.json`, `livecheck-signal` 1.0.0: `invoicePaid` sourced from `livecheck-erp`, and a signed approval for the target                  |
| Capability  | `livecheck:signal`, registered as an external connector to the release check endpoint (`../external-connector`)                            |
| Agent key   | `livecheck-agent`, allowed only `livecheck:grant` and `livecheck:signal` (made in `../authority-grant`, stage 3)                           |
| Scripts     | `../governance.ts` for the maker checker steps, `send.ts` for the agent's requests                                                         |

## Before you start

- In the repository root: `npm ci`, then `npm run build`.
- The maker key, the checker key and the checker's step up private key file; the approver private key file.
- The Vercel CLI, logged in, scope `pavan-dev-singh-charaks-projects`.
- The agent key `livecheck-agent` (`../authority-grant/README.md`, stage 3). If you have not run that check, run its
  stage 3 alone.

Set these once, in one Windows PowerShell window, from the repository root:

```powershell
$env:PARMANA_URL = "https://parmana-api-real.vercel.app"
function Use-Key([string]$label) {
  $env:PARMANA_API_KEY = [System.Net.NetworkCredential]::new("", (Read-Host "$label API key" -AsSecureString)).Password.Trim()
  "  $label key: $($env:PARMANA_API_KEY.Length) characters"
}
$g = "examples/live-checks/governance.ts"
$here = "examples/live-checks/business-signal-source"
$sourceUrl = "https://parmana-signal-check.vercel.app/api/signals"
$keyDir = "$env:USERPROFILE\parmana-signal-check-key"
$deployDir = "$env:USERPROFILE\parmana-signal-check"
$stepUp = "$env:USERPROFILE\parmana-checker\step-up.private.pem"
$stepUpId = "checker-pavan"
$approver = "$env:USERPROFILE\parmana-approver\manager-pavan__manager-pavan-key-1.private.pem"
$approverArgs = @("--approver-key-file", $approver, "--approver-id", "manager-pavan", "--approver-key-id", "manager-pavan-key-1")
```

## 1. Make the source's key and deploy the source

```powershell
New-Item -ItemType Directory -Force $keyDir | Out-Null
node -e "const c=require('crypto');const k=c.generateKeyPairSync('ed25519');const f=require('fs');f.writeFileSync(process.argv[1]+'/private.pem',k.privateKey.export({format:'pem',type:'pkcs8'}));f.writeFileSync(process.argv[1]+'/public.pem',k.publicKey.export({format:'pem',type:'spki'}))" $keyDir

npx tsx "$here/build-endpoint.ts" --parmana-url $env:PARMANA_URL --endpoint-url $sourceUrl --key-id livecheck-erp-1 --out $deployDir
vercel link --yes --project parmana-signal-check --scope pavan-dev-singh-charaks-projects --cwd $deployDir
Get-Content "$keyDir\private.pem" -Raw | vercel env add SOURCE_PRIVATE_KEY_PEM production --sensitive --cwd $deployDir
vercel deploy --prod --yes --cwd $deployDir

try { Invoke-WebRequest -Method Post $sourceUrl -Body "{}" -ContentType "application/json" -UseBasicParsing } catch { $_.Exception.Response.StatusCode.value__ }
```

**Expect:** `Built ...`, `Audience: https://parmana-signal-check.vercel.app/api/signals`, the project linked (it is
created if new), the variable added, a production deployment `✓ Ready`, then `401`: the source refuses anything not
signed by Parmana.

**If not:** if `vercel link` says the project does not exist, create it with
`vercel project add parmana-signal-check --scope pavan-dev-singh-charaks-projects` and link again. If the source is
built for one address and Parmana signs for another, it refuses every query; read `signal_refused` lines in its logs.
If Vercel gives the project another address, build again with that address as `--endpoint-url` and use it
from here on. If the last line is not `401`, stop: do not register it.

`private.pem` is a secret: keep `$keyDir` out of the repository, and delete it after the check (the copy in Vercel is
enough). It signs only this demo source's answers.

## 2. Rebuild the release check endpoint, so its log shows the conditions

The release check endpoint (`../external-connector`) now logs the `conditions` a release carries. The deployment from
2026-10-01 does not; rebuild and deploy it once:

```powershell
npx tsx examples/live-checks/external-connector/build-endpoint.ts --parmana-url $env:PARMANA_URL --endpoint-url https://parmana-release-check.vercel.app/api/release --out "$env:USERPROFILE\parmana-release-check"
vercel deploy --prod --yes --cwd "$env:USERPROFILE\parmana-release-check" --scope pavan-dev-singh-charaks-projects
```

**Expect:** `✓ Ready`. (If the folder was never linked, Vercel asks; choose the existing project
`parmana-release-check`.)

## 3. Register the source, the policy and the capability

```powershell
Use-Key "Maker"
npx tsx $g propose-source --name livecheck-erp --endpoint-url $sourceUrl --public-key-file "$keyDir\public.pem" --key-id livecheck-erp-1
npx tsx $g propose-policy --file "$here/policy.json"
npx tsx $g propose-connector --capability livecheck:signal --endpoint-url https://parmana-release-check.vercel.app/api/release --policy livecheck-signal --allowed-parameters invoiceId,note
```

**Expect:** three `Proposed: <id>, PENDING_APPROVAL` lines. Copy the three ids: source, policy, connector.

```powershell
Use-Key "Checker"
npx tsx $g approve --kind source --id <source id> --step-up-key-file $stepUp --step-up-key-id $stepUpId
npx tsx $g approve --kind policy --id <policy id> --step-up-key-file $stepUp --step-up-key-id $stepUpId
npx tsx $g approve --kind connector --id <connector id> --step-up-key-file $stepUp --step-up-key-id $stepUpId
```

**Expect:** each change shown, then `Status: APPROVED`, three times. Approve the source first: a policy naming a source
that is not registered refuses every request.

## 4. The four requests

```powershell
Use-Key "livecheck-agent"
npx tsx "$here/send.ts" --case paid @approverArgs --out "$here/record-1-paid.json"
npx tsx "$here/send.ts" --case unpaid @approverArgs --out "$here/record-2-unpaid.json"
npx tsx "$here/send.ts" --case mismatch @approverArgs --out "$here/record-3-mismatch.json"
npx tsx "$here/send.ts" --case unknown @approverArgs --out "$here/record-4-unknown.json"
```

**Expect, request 1:** `sourced: {"invoicePaid":...}`, `APPROVED` in about 25 to 35 seconds, the endpoint's answer
with `success: true`, `Verifies offline : true`, `Validation : VALID`, `Trusted Signal : livecheck-erp says INV-LC-PAID
= true, ... source proof verified: true`, then `As required`.

**Expect, requests 2 to 4:** `REFUSED`, with validation `VALID`, `INVALID` and `MISSING_DATA` in that order, then
`As required` each time.

**If request 1 times out, do not send it again.** Read its record first: `GET /trust-records/<id>` with the agent key.

## 5. The two endpoints' side

- Vercel logs of `parmana-signal-check`: one `signal_answered` line per request, naming its transaction and the
  invoice, with `value` `true`, `false`, `false`, and `status` `not_found` for the last; no `signal_refused`.
- Vercel logs of `parmana-release-check`: exactly one `release_acted` line for this check, for request 1, with
  `conditions` holding `invoicePaid` from `livecheck-erp`, value `true`, and a `validUntil` about 5 minutes after the
  answer. Requests 2 to 4 were refused before anything was released.

## 6. Afterwards

```powershell
Use-Key "Maker"
npx tsx $g propose-revoke --kind connector --capability livecheck:signal
npx tsx $g propose-revoke --kind source --name livecheck-erp
Use-Key "Checker"
npx tsx $g approve --kind connector --id <id> --step-up-key-file $stepUp --step-up-key-id $stepUpId
npx tsx $g approve --kind source --id <id> --step-up-key-file $stepUp --step-up-key-id $stepUpId
Remove-Item Env:\PARMANA_API_KEY
Remove-Item -Recurse $keyDir
```

Then remove `livecheck-agent` (delete `%USERPROFILE%\parmana-entries\livecheck-agent.json` and run the deploy part of
`../authority-grant/README.md` stage 3 again), and delete the Vercel project `parmana-signal-check` or leave it: it
answers only queries signed by Parmana for its own address, and only about the demo invoices.

The four `record-*.json` files hold no secret. Keep them as the evidence.

## When it fails

| You see                                                                               | Meaning and fix                                                                                                      |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `EXTERNAL_ENDPOINT_ADDRESS_REFUSED` when proposing or approving                       | The host did not resolve only to public addresses at that moment. Run the step again; if it persists, stop.          |
| `is not under a policy that sources invoicePaid`                                      | The policy in stage 3 is not approved.                                                                               |
| Request 1 refused with `SOURCE_UNAVAILABLE`                                           | The source is not approved, not deployed, or answers wrongly: read `parmana-signal-check`'s logs (`signal_refused`). |
| `signal_refused`: "the query is not meant for this endpoint"                          | The source was built for another address than it is registered under. Build again with the registered address.       |
| `signal_refused`: "the query is not signed by Parmana"                                | The bundle has another Parmana public key, for example after a key rotation. Build and deploy it again.              |
| Request 1 refused with `VALIDATION_EXPIRED`                                           | The source's clock or the request is late by more than 60 seconds. Send it again as a new request.                   |
| `authentication required`, `NON_HUMAN_CALLER_DENIED`, `STEP_UP_AUTHORIZATION_INVALID` | As in `../authority-grant/README.md`, "When it fails".                                                               |
| `WRONG: required ...`                                                                 | A rule did not hold. Stop, keep the output and the record file, and report it.                                       |
