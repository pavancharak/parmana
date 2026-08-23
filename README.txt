PARMANA FRAUD DEFENSE LAB
Mastercard Innovation Challenge 2026
=====================================

WHAT THIS IS
------------
A payment fraud defense system where every important decision is signed
by an authority OUTSIDE the code that made it — bounded fraud-simulation
agents, a fraud detector, and human overrides. Nothing here relies on
"trust the logs" — every claim can be independently verified with a
public key.

See docs/attacks.md for the 5-7 fraud techniques this project addresses,
docs/how_it_works.txt for a plain-language explanation of the signing
model, and the web dashboard for the visual walkthrough judges will use.

HOW TO RUN IT
-------------
1. Install dependencies:

     pip install -r requirements.txt

2. Generate the fraud simulation (creates data/, tokens/*_auth_token.json,
   tokens/*_execution_log.json). Run from inside src/:

     cd src
     python run_simulation.py

   The first run also generates two Ed25519 keypairs under tokens/keys/
   (gitignored — never commit these). Their public halves are written to
   tokens/authority_public_key.pem and tokens/reviewer_public_key.pem so
   anyone can verify signatures without ever seeing the private keys.

3. Train the detector, sign every decision, generate override examples,
   and verify every signature (writes decisions/ and web/data/dashboard.json):

     python check_results.py

4. Serve the dashboard (must be served over HTTP, not opened as a local
   file, or the browser's fetch() will be blocked):

     cd ../web
     python -m http.server 8000

   Then open http://localhost:8000/index.html

WHAT TO EXPECT
--------------
- ~1900 total transactions (roughly 900 legitimate, 1000 fraudulent)
  split across 3 bounded agents plus a legitimate-activity generator.
- A RandomForest detector catching roughly 85-90% of fraud with a
  single-digit false positive rate — intentionally imperfect, because a
  100%-accurate detector on synthetic data would be a red flag to anyone
  who has worked in fraud, not a feature.
- Every agent token, every block/flag/allow decision, and every human
  override signed and independently re-verifiable using only the public
  key files in tokens/.

FOLDER GUIDE
------------
src/                 all Python source
  authority_signer.py   the external authority (Ed25519 signing + verification)
  fraud_agents.py       the 3 bounded fraud-simulation agents
  data_generator.py     legitimate transaction population generator
  fraud_detector.py     RandomForest detector + signed-decision pipeline
  run_simulation.py     entry point: run the agents
  check_results.py      entry point: train, sign, verify, build dashboard data
data/                 good_transactions.json, fraud_transactions.json
tokens/               signed agent tokens, execution logs, public keys
                       (tokens/keys/ holds PRIVATE keys — gitignored)
decisions/            block_decisions.json, override_log.json (all signed)
web/                  the dashboard (index.html, style.css, script.js, data/)
docs/                 attacks.md / attacks.json (Part 1), how_it_works.txt

RE-RUNNING
----------
Both scripts are deterministic (seeded) except for token issuance
timestamps and record IDs, so re-running reproduces essentially the same
transaction population. Re-running run_simulation.py regenerates
data/*.json and tokens/*_auth_token.json; re-running check_results.py
regenerates decisions/*.json and web/data/dashboard.json from whatever is
currently in data/.
