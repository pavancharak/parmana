# Challenge Records

Each file here is one Challenge Record ([RFC-0022](../../docs/rfcs/RFC-0022-Challenge-Record.md)):
a claim or assumption someone questioned, what was checked, what was found and what changed.
The file is the public copy. The same record is written to the `challenge_records` table with:

```bash
npx tsx scripts/record-challenge.ts governance/challenges/<id>.json --dry-run
npx tsx scripts/record-challenge.ts governance/challenges/<id>.json
```

`DATABASE_URL` is read from the shell or `.env`, and the first line printed names the
database. The script never overwrites a record that already exists.

Records are append only. A file is not edited after it is written to the database; a
correction is a new record whose `supersedes` names the old one.

| Record                                | Claim challenged                                                | Finding             |
| ------------------------------------- | --------------------------------------------------------------- | ------------------- |
| [CR-2026-10-001](CR-2026-10-001.json) | "No AI agent can execute without a signed human approval, ever" | partially-confirmed |
