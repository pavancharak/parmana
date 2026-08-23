# Part 1 — Seven Ways AI Commits Payment Fraud

Three of these are actively simulated in this lab by the three bounded
agents (`src/fraud_agents.py`). The other four are documented honestly as
known gaps — real attack paths this lab does not generate traffic for,
listed so judges see the boundary of what was actually tested versus what
is future work.

## 1. AI-Fabricated Identity — *simulated*
**Where:** Account creation / onboarding.
**Needs:** A generative model, a few real customer profiles to imitate, an
open signup path.
**Why it's hard to catch:** Each transaction looks statistically normal
because the AI copies real spending shape. There's no history to compare
against on transaction #1.
**Damage:** New-account fraud, promo abuse, mule accounts.

## 2. Spending Pattern Replication (Card Testing & Draining) — *simulated*
**Where:** Authorization / payment processing.
**Needs:** A stolen card/token and a generator that mimics the
cardholder's usual amount/merchant/timing shape at machine speed.
**Why it's hard to catch:** Amounts and merchants resemble genuine
history; the anomaly is velocity and cumulative volume, visible only in
aggregate.
**Damage:** Direct monetary loss, chargebacks, network penalties.

## 3. Payment Form / API Fuzzing — *simulated*
**Where:** Client input into backend processing.
**Needs:** Knowledge of the form/API schema and an automated fuzzer.
**Why it's hard to catch:** Loud individually, but used as reconnaissance
— the one field that doesn't reject cleanly becomes tomorrow's entry
point.
**Damage:** Crashes, injection vulnerabilities, a discovered bypass used
later.

## 4. AI Voice/Chat Social Engineering — *not simulated (known gap)*
**Where:** Customer authentication via call center or chat support.
**Needs:** Voice cloning or a conversational model plus leaked personal
data about the victim.
**Why it's hard to catch:** Convincing enough to pass knowledge-based
authentication questions.
**Damage:** Account takeover, unauthorized card issuance, disabled fraud
alerts.

## 5. Authorization Limit Probing — *partially represented*
**Where:** Authorization.
**Needs:** A stolen card and a script submitting many small transactions
across merchants to map fraud thresholds before one large charge.
**Why it's hard to catch:** Each probe sits under per-transaction
thresholds; only visible when correlated across merchants.
**Damage:** Reveals defenders' thresholds, exploited in a precisely-sized
follow-up charge.
**Note:** Agent 2's high-velocity small transactions partially resemble
this pattern but do not implement threshold-mapping logic specifically.

## 6. AI-Generated KYC Document Forgery — *not simulated (known gap)*
**Where:** Identity verification (KYC).
**Needs:** An image-generation model producing plausible ID documents or
selfies that pass liveness/document checks.
**Why it's hard to catch:** Can be tuned to defeat the exact verification
model in use, given query access.
**Damage:** Bypasses KYC entirely; enables fully synthetic identities.

## 7. Feedback-Loop Poisoning of the Fraud Model — *not simulated (known gap)*
**Where:** Post-decision — dispute/chargeback feedback ingestion.
**Needs:** Repeated small transactions plus false dispute signals meant to
teach a retraining pipeline that fraud patterns are normal.
**Why it's hard to catch:** Attacks the training data, not the
transaction. The model's own confidence goes up, not down.
**Damage:** Long-term degradation of detection accuracy.

---

Structured version for the dashboard: `docs/attacks.json`.
