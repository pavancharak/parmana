# Evaluating Parmana

This repository is source-available for evaluation only. Reading, building and running it to
assess Parmana is permitted. Any other use, including production deployment, redistribution or
derivative works, needs a separate written agreement with Parmana Systems. See
[LICENSE](./LICENSE).

This guide is the shortest path from a fresh clone to a working local system. It needs no
accounts, credentials, database or network access beyond `npm ci`.

## Requirements

- Node.js 24.6 or later. The hybrid Ed25519 and ML-DSA-65 signatures use `node:crypto`, which
  supports ML-DSA from 24.6.
- npm, as bundled with Node.js.
- Git, and Bash for two tests that syntax check shell scripts. On Windows, Git for Windows
  provides it.

Linux, macOS and Windows are supported.

## 1. Install, build and test

```bash
git clone https://github.com/pavancharak/parmana.git
cd parmana
npm ci
npm run build
npm test
```

`npm run build` comes before `npm test` because tests import the workspace packages from their
built `dist/` output; `npm test` refuses to run against stale output.

No `.env` is needed. The test setup uses the same local defaults as CI (the committed
`./policies`, in memory storage, local Ed25519 keys generated per run) unless you set them
yourself. Suites that need live services (HubSpot, Supabase) skip cleanly. Expect roughly
2,800 passing tests and about 50 skipped.

## 2. Run the examples

```bash
npm run examples
```

This runs every tutorial in [examples/tutorials/](examples/tutorials/) against local mock
connectors, with throwaway keys that are deleted afterwards. To see the whole chain in one
walkthrough (policy evaluation, signed authorization, envelope verification, credential
isolation, connector execution and the signed trust record):

```bash
npx tsx examples/tutorials/60-end-to-end-enterprise-execution/run.ts
```

## 3. Try the hosted sandbox (optional)

A public sandbox runs the same API with demo policies. The scripts in
[examples/sandbox-playground/](examples/sandbox-playground/) call it from cURL, PowerShell,
TypeScript or Python. See
[Live API and demos](https://docs.parmanasystems.com/guides/live-api-and-demos) for
authentication and the request shape.

## 4. Verify a record offline

Every approved action produces a signed Execution Trust Record. It can be checked with only
the record and the public keys, without Parmana's runtime or database, using
[`@parmana/sign`](https://github.com/pavancharak/parmana-sign) or this repository's own
`packages/crypto/src/OfflineVerifier.ts`. See
[Verification SDK](https://docs.parmanasystems.com/sdks/parmana-sign/overview).

## Where to read next

- [Audit guide](https://docs.parmanasystems.com/evaluation/audit-guide): the system under
  evaluation, the points where execution is refused, what an attacker controls in each case
  (including a compromised signing key), and a bounded scenario pinned to a commit.
- [docs/CLAIMS.md](docs/CLAIMS.md): every technical claim, scoped to its evidence, with the
  code and tests that back it, and what is explicitly not claimed.
- [docs/VERIFICATION-GAPS.md](docs/VERIFICATION-GAPS.md): what was found missing or wrong and
  how it was closed.
- [docs/architecture/system-architecture.md](docs/architecture/system-architecture.md):
  packages and how a request flows through them.
- [The Parmana Handbook](https://docs.parmanasystems.com/handbook/overview): the codebase
  explained chapter by chapter.

## Licensing

The proprietary [LICENSE](./LICENSE) covers the whole repository, including the client SDKs
in [typescript/](typescript/) (`@parmana/sdk` on npm) and [python/](python/) (`parmana` on
PyPI). `@parmana/sign` is a separate repository under the Apache License 2.0.

## Questions and feedback

Email [founder@parmanasystems.com](mailto:founder@parmanasystems.com) for questions, a guided
walkthrough, or licensing. Report security issues privately as described in
[SECURITY.md](SECURITY.md).
