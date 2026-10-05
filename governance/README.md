# Policy approval log

`policy-approvals.jsonl` is a public, append only record of every policy change approved
through Parmana's maker checker process (CLAIMS.md 2.26, 2.34). Anyone can check it without the
server or the database.

## What one line holds

Each line is one approval, exactly as the production server stored and signed it, inside a
hash chain:

```json
{
  "seq": 1,
  "prevEntryHash": null,
  "record": {
    "policyName": "customer-refund",
    "policyVersion": "1.2.0",
    "proposedBy": "...",
    "approvedBy": "...",
    "contentHashAfter": "...",
    "signature": { "algorithm": "ed25519", "keyId": "default", "value": "..." },
    "...": "..."
  },
  "entryHash": "..."
}
```

- `record` is the `PolicyChangeApprovalRecord`: which policy and version, who proposed it, who
  approved it, when, and the SHA-256 of the approved policy content. It is signed by the server's
  `default` key, over the same canonical JSON the server uses.
- `entryHash` is the SHA-256 of the canonical JSON of `{ seq, prevEntryHash, record }`.
- `prevEntryHash` is the previous line's `entryHash`, and `null` on the first line.

`policy-approval-keys.json` holds the public keys the records are signed with, by `keyId`.

## What it proves

- **No approval was quietly rewritten or removed.** Changing, deleting or reordering a line
  breaks the chain from that line on. CI refuses any change to this file that does not only
  append to it.
- **Each approval was signed by the server.** A record cannot be added or edited without the
  signing key.
- **The policies in this repository are the approved ones.** Each
  `policies/{name}/{version}/policy.json` can be matched to the content hash of its latest
  logged approval.
- **The database still agrees with what was published.** `check-db` fails if a logged record
  later changed or disappeared in the database.

## What it does not prove

- That the maker and the checker are two people. It records two credentials. In the current
  production deployment one person holds both (see [THREAT-MODEL.md](../THREAT-MODEL.md), T11).
- That an approved policy is a good one.
- Anything against someone holding the signing key and write access to both the database and
  this repository's main branch. The log raises the cost: a rewrite has to change history that
  has already been published and copied.

The records name the maker and the checker by their caller IDs. Publishing the log makes those
IDs public; they cannot be removed without breaking the signatures.

## Check it

```bash
npm ci
npm run build
npm run policy-log:verify
```

This checks the chain and every signature, and reports any policy file whose content is not the
latest logged approval. `-- --require-coverage` turns that report into a failure, and
`-- --base <commit>` also checks that the log only grew since that commit.

## Update it

After a policy change is approved in production:

```bash
# The read only role CI already uses for verify-policy-approvals.
export SUPABASE_URL=...
export SUPABASE_ANON_KEY=...
npm run policy-log:export
```

`export` appends the approvals the log does not hold yet, in approval order, and fetches the
public key for any new `keyId` from `GET /keys/{keyId}` on the production API
(`PARMANA_API_URL` to override). It refuses to write if a record already in the log changed or
disappeared in the database. Commit the result through a pull request. `npm run
policy-log:check-db` makes the same comparison without writing, and fails if the log is behind.
