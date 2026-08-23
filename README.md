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
- **1,006 attack records.** Real, AI generated and pattern based examples used to test our detector, from an actual run, not a mockup.
- **85.76% caught.** Our system caught most attacks. We admit we missed 14.24%, and explain exactly why below.
- **Verified blocking.** Every block decision is signed by an authority outside the detector. You can check every signature yourself.

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

Open `http://localhost:8000`. `generate_docx.py` writes `mastercard-ai-defense-lab.docx` in the project root, a short written walkthrough with the same real numbers.

## Why this matters

Standard fraud detection: *"We caught 86% of fraud. Here are our logs."*

This system: *"We caught 86% of fraud. Here's the signature from an outside authority proving each block happened. Verify it yourself. And here's the honest log of the 14% we missed."*

The difference: proof instead of trust.

## The innovation

Every attack generator is bounded by a signed permission limit it cannot exceed. Every block decision is signed by an authority outside the detector. Every missed attack is logged and just as verifiable as a caught one.

This demonstrates that an AI system becomes trustworthy not when the detector is perfect, but when every decision, caught or missed, is signed by something outside it and can be checked by anyone.

## What judges will understand

**Tab 1:** Here are the 7 attacks we tested against.

**Tab 2:** We generated 1,006 real examples of them.

**Tab 3:** Our detector caught 85.76%, missed 14.24%, here's why.

**Tab 4:** Every block decision is signed by an authority outside the detector. You can verify it.

Bottom line: this isn't just a fraud detector. It's a detector with verifiable governance.

## The data

| Metric | Value |
|---|---|
| Attack records generated | 1,006 |
| Fraud caught | 85.76% |
| False alarms (good transactions wrongly flagged) | 6.16% |
| Fraud missed | 14.24% |
| Signed decisions checked | 578/578 verified |
| Overrides checked | 3/3 verified |
| Agent limits checked | 7/7 verified |

All real. All from one run. No cherry picked numbers, and no rounding up.

## Why did 14.24% slip through?

We didn't guess at reasons. We checked which attacks the detector actually missed, and how often.

**1. Amount isn't the signal.** We tested amounts from $10 to $10,000 against the trained detector, holding everything else typical. No amount alone ever triggered a block. The detector scores behavior and context, not the dollar figure, so a $450 fake transaction can look identical to a $450 real one.

**2. Fake identities are the hardest attack to catch.** 36% of our fake identity attacks (4 of 11 in the test set) got through. These are built specifically to copy a real spending pattern, buy from the same kind of merchants, at the same kind of times, at a similar amount. When the imitation is good, the detector has little left to go on.

**3. Fake identity documents are close behind.** In our small sample, half of the synthetic identity bundles we generated scored low enough to pass. Internally consistent fake data (a name, age, address, and income that all agree with each other) looks a lot like a real, boring customer.

**4. The biggest volume of misses comes from copied spending patterns.** 17.5% of our card testing attacks (37 of 212) got through, mostly the ones we deliberately slowed down to avoid looking like a burst of activity.

**5. A small share of decisions are genuine judgment calls.** About 2% of all decisions scored close enough to the boundary that a slightly different transaction could have gone either way. That's a real, if small, source of uncertainty, not hidden from the numbers above.

**6. Attackers can learn and adapt.** We took transactions our own detector genuinely blocked and asked an AI system to suggest small, realistic tweaks. 1 of 15 suggested tweaks actually evaded detection. Small, but real, and it's the kind of pressure a determined attacker would keep applying.

The pattern: nothing that got through broke the detector's rules loudly. It got through by staying quiet.

## Why this proves the point

Standard approach: try to make the detector perfect.

Result: attackers study the detector's rules and design fraud that doesn't obviously violate them. Always playing catch up.

Our approach: don't aim for a perfect detector. Instead:

1. Accept that some fraud will slip through.
2. Sign every decision, caught and missed, from an authority outside the detector.
3. Make even the fraud that succeeded verifiable in the record.
4. Use that record to improve detection next time.

With that governance in place: the 14.24% that slipped through is signed and logged, not hidden. It's auditable, you can see exactly which transactions passed. It's traceable, an outside authority verified the decision was really made. It's learnable, the record is there to improve the next iteration.

The missed attacks aren't a failure to hide. They're proof that the governance layer works even when the detector doesn't.

## For the judges

This demonstrates a solution to a real problem: how do you govern AI driven fraud detection?

Answer: move authority outside the detector. Bind every attack generator to a signed limit. Sign every decision from an outside source. Make all of it verifiable.

You can't prevent all fraud. You can make all of it verifiable.

## Questions

**How do I verify the signatures?**
Open the Proof tab. Click "See Sample Signature" for one real signed record, or check any file in `decisions/` and `tokens/` against the matching public key yourself.

**Is this real data?**
Yes. Run it yourself with the three commands above. Every number in this document comes from an actual run.

**Why did 14.24% slip through?**
See the section above. Real reasons, backed by checking which attacks were actually missed, not a hidden failure.

**Can the system be tricked?**
Yes, and we show it directly: 1 of 15 attempted tweaks evaded our own detector in the last run. That's the point of being honest about gaps, they become something you can measure and improve, not something you have to hide.

**Is this production ready?**
The attack simulation is a demo. The governance architecture, signed permission limits, an authority outside the detector, verifiable decisions, is the reusable part.

## Closing

Five minutes to understand. Three commands to verify. Real data, no magic.
