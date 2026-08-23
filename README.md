# Mastercard AI Defense Lab

Payment fraud detection where every decision, caught or missed, is signed by an authority outside the detector and can be independently verified.

## The problem

When a fraud detector blocks a payment, how do you know it actually happened? The detector writes its own logs. If it bugs out, gets compromised, or lies, you have no independent way to verify the decision was real.

## The solution

Move authority outside the system.

When we block fraud, an external authority signs the decision. You can verify the signature is real. If we weren't actually blocking it, the signature wouldn't exist.

This is verifiable proof, not just a claim.

## What you'll see

- **7 real fraud attacks.** We identified 7 ways AI can commit payment fraud. We simulated 6 of them, and honestly flag the 1 we didn't build.
- **793 attack records, roughly 175 per attack type.** Real, AI generated and pattern based examples used to test our detector, from an actual run, not a mockup.
- **92.44% caught.** Our system caught nearly all attacks. We admit we missed 7.56%, and explain exactly why below. Across 5 independent runs the catch rate stayed between 90.99% and 93.48%, see "Verified across 5 runs" below.
- **Verified blocking.** Every block decision is signed by an authority outside the detector. You can check every signature yourself.

## Live demo

**https://parmana.fly.dev**, the same dashboard, deployed as a static site (no backend, no API key on the server, nothing there can spend real money). It's serving the exact real data from the run described in this document, not a mockup.

## Run it

```
pip install -r requirements.txt
cp .env.example .env
```
Add your own API key to `.env` (it stays local, never committed, never shared).

```
cd src
python run_simulation.py
python check_results.py
python probe_detector.py
python generate_docx.py
python -m http.server 8000 -d ../web
```

Open `http://localhost:8000`. `generate_docx.py` writes `Parmana.docx` in the project root, a short written walkthrough with the same real numbers.

Snapshots:

<img width="1285" height="963" alt="image" src="https://github.com/user-attachments/assets/fc8b306e-c5c4-407e-8b7f-9073929bb88c" />
<img width="1893" height="966" alt="image" src="https://github.com/user-attachments/assets/52a552d9-a0ed-4484-9227-1724ea42ff51" />
<img width="1559" height="923" alt="image" src="https://github.com/user-attachments/assets/f9f7f196-9016-4b51-ac2e-e98f7e9beee7" />


## Why this matters

Standard fraud detection: *"We caught 92% of fraud. Here are our logs."*

This system: *"We caught 92% of fraud. Here's the signature from an outside authority proving each block happened. Verify it yourself. And here's the honest log of the 8% we missed."*

The difference: proof instead of trust.

## The innovation

Every attack generator is bounded by a signed permission limit it cannot exceed. Every block decision is signed by an authority outside the detector. Every missed attack is logged and just as verifiable as a caught one.

This demonstrates that an AI system becomes trustworthy not when the detector is perfect, but when every decision, caught or missed, is signed by something outside it and can be checked by anyone.

## What judges will understand

The dashboard opens on API Activity by design, that's the proof this is real, not a mockup, before anything else.

**API Activity (opens first):** every AI call this run made is logged, real timestamps, real token counts, real cost. Click Replay to watch the real log fill back in.

**Attacks:** here are the 7 attacks we tested against.

**Simulation:** we generated 793 real examples of them, roughly 175 per attack type.

**Detection Results:** our detector caught 92.44%, missed 7.56%, here's why.

**Proof:** every block decision is signed by an authority outside the detector. You can verify it.

**README (last):** the same story as this document, inside the dashboard itself.

Bottom line: this isn't just a fraud detector. It's a detector with verifiable governance.

## The data

| Metric | Value |
|---|---|
| Attack records generated | 793 (roughly 175 per attack type) |
| Fraud caught | 92.44% |
| False alarms (good transactions wrongly flagged) | 7.87% |
| Fraud missed | 7.56% |
| Signed decisions checked | 581/581 verified |
| Overrides checked | 3/3 verified |
| Agent limits checked | 7/7 verified |
| Real AI calls this run | 46, $0.0424 total, logged on the API Activity tab |

All real. All from one run. No cherry picked numbers, and no rounding up.

## Verified across 5 runs

A single run's numbers could be a lucky draw. So we ran the full pipeline 5 times in a row and recorded what the detector actually did each time, real OpenAI calls, real training, real scoring, no averaging tricks:

| Metric | Min | Max | Mean | Std dev |
|---|---|---|---|---|
| Fraud caught | 90.99% | 93.48% | 92.46% | 0.91% |
| Fraud missed | 6.52% | 9.01% | 7.54% | 0.91% |
| False positive rate | 7.00% | 8.75% | 7.81% | 0.70% |

The numbers move by a percentage point or two run to run, not because anything is broken, but because Agents 1, 2, and 4 make real OpenAI calls at a high temperature, so the generated fraud is genuinely different every time. A seed on our own random number generator wouldn't fix that, and pretending it does would be exactly the kind of unverifiable claim this whole project argues against. What we can honestly claim, and did verify directly, is that given a fixed set of generated transactions, the detector's training step itself is deterministic, run `check_results.py` twice on the same data and it produces bit identical metrics both times.

## Why did 7.56% slip through?

We didn't guess at reasons. We checked which attacks the detector actually missed, and how often.

**1. Amount isn't the signal.** We tested 175 amounts from $10 to $10,000 against the trained detector, holding everything else typical. No amount alone ever triggered a block, consistent with every time we've run this probe. The detector scores behavior and context, not the dollar figure, so a $450 fake transaction can look identical to a $450 real one.

**2. Fake identities and copied spending patterns are the two hardest attacks to catch.** 14.8% of our fake identity attacks (9 of 61 in the test set) and 15.8% of our card testing attacks (9 of 57) got through, the two highest miss rates this run. Fake identities are built specifically to copy a real spending pattern, buy from the same kind of merchants, at the same kind of times, at a similar amount. Copied patterns include ones we deliberately slowed down to avoid looking like a burst of activity. We checked the breakdown by type for this run only, not all 5, so we won't claim this ranking holds every time, just that it's real for the run these numbers describe.

**3. Document forgery, social engineering, and form attacks were fully caught this run.** 0 missed out of 46, 16, and 58 tested respectively. That's a real result from this run, not a guarantee it holds at every scale, small categories can swing to 0% or back up on a different run.

**4. A small share of decisions are genuine judgment calls.** About 3.8% of all decisions scored close enough to the boundary that a slightly different transaction could have gone either way. That's a real, if small, source of uncertainty, not hidden from the numbers above.

**5. Attackers can learn and adapt.** We took 25 transactions our own detector genuinely blocked and asked an AI system to suggest small, realistic tweaks, 175 variants in total. 25 of them actually evaded detection. Real, and it's the kind of pressure a determined attacker would keep applying.

The pattern: nothing that got through broke the detector's rules loudly. It got through by staying quiet.

## Why this proves the point

Standard approach: try to make the detector perfect.

Result: attackers study the detector's rules and design fraud that doesn't obviously violate them. Always playing catch up.

Our approach: don't aim for a perfect detector. Instead:

1. Accept that some fraud will slip through.
2. Sign every decision, caught and missed, from an authority outside the detector.
3. Make even the fraud that succeeded verifiable in the record.
4. Use that record to improve detection next time.

With that governance in place: the 7.56% that slipped through is signed and logged, not hidden. It's auditable, you can see exactly which transactions passed. It's traceable, an outside authority verified the decision was really made. It's learnable, the record is there to improve the next iteration.

The missed attacks aren't a failure to hide. They're proof that the governance layer works even when the detector doesn't.

## For the judges

This demonstrates a solution to a real problem: how do you govern AI driven fraud detection?

Answer: move authority outside the detector. Bind every attack generator to a signed limit. Sign every decision from an outside source. Make all of it verifiable.

You can't prevent all fraud. You can make all of it verifiable.

## Questions

**How do I verify the signatures?**
Open the Proof tab. Click "See Sample Signature" for one real signed record, or check any file in `decisions/` and `tokens/` against the matching public key yourself.

**Is this real data?**
Yes. Run it yourself with the commands above. Every number in this document comes from an actual run.

**Why did 7.56% slip through?**
See the section above. Real reasons, backed by checking which attacks were actually missed, not a hidden failure.

**Can the system be tricked?**
Yes, and we show it directly: 25 of 175 attempted tweaks evaded our own detector in the last run. That's the point of being honest about gaps, they become something you can measure and improve, not something you have to hide.

**Is this production ready?**
The attack simulation is a demo. The governance architecture, signed permission limits, an authority outside the detector, verifiable decisions, is the reusable part.

## Repository layout

```
README.md              this document
Parmana.docx           written walkthrough, generated by src/generate_docx.py
requirements.txt
.env.example            copy to .env and add your own OPENAI_API_KEY

src/
  run_simulation.py     Phase 1: runs Agents 1, 2, 4, 5, 6
  check_results.py      Phase 2: trains the detector, signs decisions
  probe_detector.py     Phase 3: runs Agents 3 and 7 against the trained model
  generate_docx.py      builds Parmana.docx from the same real data
  fraud_agents.py       all 7 agent classes
  fraud_detector.py     the RandomForest classifier and scoring logic
  authority_signer.py   Ed25519 signing and verification
  llm_client.py         OpenAI wrapper, real cost and call logging
  data_generator.py     the legitimate transaction population

data/                   generated transactions and agent outputs (tracked, regenerable)
decisions/              signed block decisions, overrides, and the red team report
tokens/                 signed authorization tokens, execution logs, and public keys
docs/                   the deeper technical writeup (attacks.md, how_it_works.txt)
web/                    the dashboard (index.html, script.js, style.css, data/dashboard.json)
```

Not tracked in git: `.env` (your API key), `models/` (the trained model file, regenerated by `check_results.py`), and `tokens/keys/` (the authority's and reviewer's private signing keys, regenerated on first run).

Built with scikit-learn (a RandomForest classifier), the `cryptography` package (Ed25519 signing), and the OpenAI API (gpt-4o-mini) for the agents that generate synthetic content. No other backend, the dashboard is static HTML, CSS, and JavaScript reading a single JSON file. The deeper technical writeup is in `docs/how_it_works.txt` for anyone who wants it.

## Closing

Five minutes to understand. A few commands to verify. Real data, no magic.
