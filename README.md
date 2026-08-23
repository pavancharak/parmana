# Parmana Fraud Defense Lab

A payment fraud defense system where every important decision is signed by an authority outside the code that made it, so the decision can be verified, not just believed.

## The problem

When a fraud detector says it blocked a transaction, how do you know it actually happened? The detector writes its own logs. If it has a bug, gets compromised, or just lies, you have no independent way to tell.

## The answer

We separate decision making from record keeping. When the detector blocks fraud, an external authority (a different piece of code, holding a private key nothing else touches) signs that decision. Anyone can verify the signature with a public key file. If the detector's claim doesn't match what was actually signed, the signature won't verify. That's the whole idea: **authority outside the system.**

## What we built

**1. Seven fraud attacks, three simulated, four admitted gaps.**
`docs/attacks.md` lists seven real ways AI is used to commit payment fraud: fake identities, stolen card pattern replication, payment form fuzzing, voice cloning social engineering, threshold probing, KYC document forgery, and model poisoning feedback loops. We built working simulations for the first three. The other four are listed honestly as gaps we didn't build, not swept under the rug.

**2. Three agents, each bounded by a signed permission token.**
Each fraud simulation agent asks an external authority for a token before it does anything: *"you may create at most 10 fake identities,"* *"at most 1000 transactions,"* *"at most 1000 form probe attempts."* The agent's code checks its own count against that number on every action. It can't exceed it, because the number came from outside the agent, not from its own judgment. `tokens/*_execution_log.json` shows exactly how many operations each agent actually performed against its authorized ceiling. In the last run, Agent 1 used 10/10, Agent 2 used 700/1000, and Agent 3 used 240/1000. All three stayed within bounds, and every token's signature still verifies.

**3. A detector whose block decisions are signed, not just logged.**
A RandomForest classifier scores each transaction. That score isn't a decision until it's sent to the authority, which signs a record of the transaction ID, the score, and the resulting decision: BLOCK, FLAG, or ALLOW. Only the signed record gets written to disk. In the last run, the detector caught **88% of fraud with a 5.4% false positive rate**: 261 BLOCK, 19 FLAG, and 297 ALLOW decisions, all signed. Three human overrides are also included, each signed with a *different* key than the detector's decisions, so an override can never be mistaken for, or forged as, an official authority decision.

## How to see it

```
pip install -r requirements.txt
cd src && python run_simulation.py
python check_results.py
cd ../web && python -m http.server 8000
```

Then open `http://localhost:8000`. Five minutes, four tabs.

## What you'll see

**Tab 1: Attacks.** The seven fraud techniques, with a badge on each showing whether it was simulated or left as a known gap.

**Tab 2: Simulator.** Click "Replay agent simulation" and watch each agent request its token and generate fraud transactions. Click "Show signed authorization token" on any agent card. You'll see the actual JSON, for example `"max_operations": 1000`, and the execution log next to it showing the agent generated exactly that many or fewer, never more.

**Tab 3: Detector.** Confusion matrix, the top signals the model actually relies on, and a sample of signed block decisions. Click any row to see the full signed JSON record, including the signature. Below that, the override log: three real examples of a human (or a downstream monitoring system) changing a decision, each signed by the reviewer key, with a name and a written justification.

**Tab 4: Honest Answer.** What this system can prove, what it can't, and one concrete transaction (ID, score, decision, signature) that you can verify yourself against `tokens/authority_public_key.pem`.

## Honest limitations

Our detector catches 88% of fraud, not 100%. We didn't tune it to look perfect. A fraud detector that's 100% accurate on any dataset is a sign something's wrong with the dataset, not the model. The 12% that gets through is disproportionately the fake identity attack, which is explicitly designed to be hard to catch: each individual transaction looks statistically like normal spending, because that's the point of the attack. The 5.4% false positive rate is real too. Some legitimate transactions (a customer traveling, an unusual but genuine purchase) land close enough to the fraud pattern to get flagged. Both numbers are visible on Tab 4, not hidden in an appendix.

We also didn't simulate four of the seven attacks we identified. Voice cloning social engineering, KYC document forgery, threshold probing, and model poisoning are documented but not built. We'd rather say that plainly than imply broader coverage than we have.

## Why this matters

Most fraud detection systems answer *"did you catch this fraud?"* with *"our logs say yes."* But the logs are written by the system being asked. This system answers differently: *"an external authority signed off on this decision. Here's the signature, go verify it."* You don't have to trust our claim, because you can check the proof yourself: load the public key, load the signed record, run the same short verification function we used (`src/authority_signer.py::verify_record`), and see whether it matches. That's the difference between assertion and evidence.

Everything here is built to be transparent and verifiable. Click the buttons. Inspect the signatures. The proof is in the code.
