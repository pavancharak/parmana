# Parmana Fraud Defense Lab

A payment fraud defense system where every important decision is signed by an authority outside the code that made it, so the decision can be verified, not just believed.

## The problem

When a fraud detector says it blocked a transaction, how do you know it actually happened? The detector writes its own logs. If it has a bug, gets compromised, or just lies, you have no independent way to tell.

## The answer

We separate decision making from record keeping. When the detector blocks fraud, an external authority (a different piece of code, holding a private key nothing else touches) signs that decision. Anyone can verify the signature with a public key file. If the detector's claim doesn't match what was actually signed, the signature won't verify. That's the whole idea: **authority outside the system.**

## What we built

**1. Seven fraud attacks, six simulated, one admitted gap.**
`docs/attacks.md` lists seven real ways AI is used to commit payment fraud. We built working simulations for six of them, four using real OpenAI API calls (GPT-4o-mini), two by directly attacking our own trained detector. Feedback loop poisoning of a retraining pipeline is the one honest gap: we don't run a persistent retraining process for it to poison, so we didn't fake it.

**2. Seven agents, each bounded by a signed permission token, four making real GPT calls.**
Every agent asks an external authority for a token before it does anything: *"you may create at most 10 fake identities,"* *"at most 8 social engineering transcripts,"* *"at most 10 KYC bundles."* The agent's code checks its own count against that number on every action, it can't exceed it, because the number came from outside the agent, not from its own judgment. In the last run: Agent 1 (Fake Identity, GPT) used 10/10, Agent 2 (Social Engineer, GPT) used 8/8, Agent 4 (KYC Forger, GPT) used 10/10, Agent 5 (Pattern Replicator, statistical) used 700/1000, Agent 6 (Injection Generator, known payloads) used 240/1000. Agents 3 and 7 run in a second phase against the trained detector (below). Every token's signature still verifies, and the whole run of GPT calls cost about $0.002.

**3. A detector whose block decisions are signed, not just logged.**
A RandomForest classifier scores each transaction. That score isn't a decision until it's sent to the authority, which signs a record of the transaction ID, the score, and the resulting decision: BLOCK, FLAG, or ALLOW. Only the signed record gets written to disk. In the last run, the detector caught **86.75% of fraud with a 5.8% false positive rate**: 264 BLOCK, 14 FLAG, and 300 ALLOW decisions, all signed. Three human overrides are also included, each signed with a *different* key than the detector's decisions, so an override can never be mistaken for, or forged as, an official authority decision.

**4. Phase 2: we red team our own detector, not a fake external system.**
Agent 3 (Limit Prober) submits real amounts from $10 to $10,000 through the actual trained model and reads back its real decision boundary, no fabricated Mastercard sandbox, just our own classifier. Agent 7 (Feedback Loop Exploit) samples transactions our detector genuinely blocked, asks GPT to propose small realistic feature tweaks, and rescores every variant through the real model. In the last run, 2 of 15 GPT suggested variants actually evaded detection. Both reports are signed and shown on the Red Team tab.

## How to see it

```
pip install -r requirements.txt
cp .env.example .env
```
Open `.env` and add your own `OPENAI_API_KEY` (never share this key; it stays local and gitignored).

```
cd src
python run_simulation.py
python check_results.py
python probe_detector.py
cd ../web && python -m http.server 8000
```

Then open `http://localhost:8000`. Five minutes, four tabs, plain English.

## What you'll see

**Tab 1: Attacks.** The seven fraud techniques in plain language, with a badge on each showing whether it was simulated and how many examples we generated, or left as a known gap.

**Tab 2: Simulation.** One big number: total attack records generated. A simple breakdown by attack type underneath. Click "View Sample Data" for a readable table of real records, amount, merchant, and outcome, no JSON.

**Tab 3: Detection Results.** The headline catch rate, a green/red split bar for caught versus missed, and the false positive rate stated plainly. An honest paragraph on why fraud slips through. Click "View Missed Attacks" for real examples that got past the detector.

**Tab 4: Proof.** Blocks, overrides, and token enforcement as simple verified stat cards, plus the two red team results (threshold found, evasions found) folded in as more of the same. Click "See Sample Signature" for one real signed record.

The full technical detail behind all of this, the raw signed JSON, the actual GPT prompts, the Ed25519 verification code, is in `docs/how_it_works.txt` and the `src/` files for anyone who wants to go deeper. The dashboard is the front door; nothing is hidden, just not dumped on screen by default.

## Honest limitations

Our detector catches 86.75% of fraud, not 100%. We didn't tune it to look perfect. A fraud detector that's 100% accurate on any dataset is a sign something's wrong with the dataset, not the model. The false positive rate (5.8%) is real too: some legitimate transactions (a customer traveling, an unusual but genuine purchase) land close enough to the fraud pattern to get flagged. Both numbers are visible on Tab 5, not hidden in an appendix.

Agent 3 found that no amount alone triggers a BLOCK across the full $10 to $10,000 range we tested, amount isn't our detector's dominant signal (velocity and location are), so an attacker who only varies amount learns nothing useful against this specific model. That's a real property of this detector, not a result we picked because it looked good.

Agent 7 tested 15 GPT suggested variants against 5 transactions closest to the decision threshold, not an exhaustive adversarial search. A determined attacker with more queries and more variants per transaction would very likely find more than 2 evasions. We sampled boundary cases on purpose (the highest confidence blocks are trivially robust to small nudges, testing those would have made the finding look artificially reassuring), but a small sample is still a small sample.

We also didn't simulate feedback loop poisoning of a retraining pipeline, that would require a persistent retraining process this lab doesn't run, so we left it as a documented gap instead of faking it.

## Why this matters

Most fraud detection systems answer *"did you catch this fraud?"* with *"our logs say yes."* But the logs are written by the system being asked. This system answers differently: *"an external authority signed off on this decision. Here's the signature, go verify it."* You don't have to trust our claim, because you can check the proof yourself: load the public key, load the signed record, run the same short verification function we used (`src/authority_signer.py::verify_record`), and see whether it matches. That's the difference between assertion and evidence.

Everything here is built to be transparent and verifiable. Click the buttons. Inspect the signatures. Read the actual GPT calls and their real cost. The proof is in the code.
