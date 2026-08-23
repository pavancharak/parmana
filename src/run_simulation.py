"""
Entry point: python run_simulation.py

Runs the three bounded fraud agents against a pool of legitimate
transaction data, producing:
  - data/good_transactions.json
  - data/fraud_transactions.json
  - tokens/*_auth_token.json          (signed authorization for each agent)
  - tokens/*_execution_log.json       (proof each agent stayed in bounds)
"""

import json
import random
from pathlib import Path

from data_generator import generate_good_transactions
from fraud_agents import (
    FakeIdentityAgent,
    PatternCopierAgent,
    FormBreakerAgent,
    make_seed_profiles,
    make_stolen_card_histories,
)

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

FORM_FIELDS = ["amount", "currency", "card_number", "cvv", "billing_zip", "customer_name"]

RAW_FEATURE_FIELDS = [
    "amount", "hour_of_day", "seconds_since_prev_tx",
    "location_mismatch_km", "pattern_similarity", "ai_generated_signal",
]


def inject_realistic_confusion(good, fraud, fraud_camouflage_rate=0.15, legit_anomaly_rate=0.05, seed=17):
    """No feature set catches everything. To keep the detector's reported
    accuracy honest rather than an artifact of clean synthetic separation,
    some fraud (fake-identity and pattern-copy only, not the loud
    form-breaker) is given feature values copied from a real legitimate
    transaction — genuinely indistinguishable behavior, same as a
    well-disguised attacker in production. Symmetrically, some legitimate
    transactions get feature values copied from fraud — genuinely
    anomalous-but-legitimate behavior, the real source of false positives.
    Labels (is_fraud) never change; only the observable features do."""
    rnd = random.Random(seed)
    good = [dict(t) for t in good]
    fraud = [dict(t) for t in fraud]

    camouflage_pool = [t for t in fraud if t["attack_type"] in ("fake_identity", "pattern_copy")]
    for tx in rnd.sample(camouflage_pool, int(len(camouflage_pool) * fraud_camouflage_rate)):
        donor = rnd.choice(good)
        for f in RAW_FEATURE_FIELDS:
            tx[f] = donor[f]

    for tx in rnd.sample(good, int(len(good) * legit_anomaly_rate)):
        donor = rnd.choice(fraud)
        for f in RAW_FEATURE_FIELDS:
            tx[f] = donor[f]

    return good, fraud


def main():
    print("=" * 70)
    print("PARMANA FRAUD DEFENSE LAB: Simulation Run")
    print("=" * 70)

    print("\n[1/4] Generating legitimate transaction population...")
    good_transactions = generate_good_transactions(n_customers=200, avg_tx_per_customer=5)
    (DATA_DIR / "good_transactions.json").write_text(json.dumps(good_transactions, indent=2))
    print(f"      -> {len(good_transactions)} legitimate transactions written to data/good_transactions.json")

    print("\n[2/4] Agent 1 (Fake Identity Maker) requesting authorization token...")
    agent1 = FakeIdentityAgent(max_identities=10)
    print(f"      -> token granted: max_operations={agent1.token['max_operations']}, signed record_id={agent1.token['record_id']}")
    seeds = make_seed_profiles(good_transactions, n=10)
    fraud_identity = agent1.run(seeds)
    print(f"      -> executed {agent1.executed}/{agent1.token['max_operations']} authorized identities, producing {len(fraud_identity)} transactions")

    print("\n[3/4] Agent 2 (Spending Pattern Copier) requesting authorization token...")
    agent2 = PatternCopierAgent(max_transactions=1000)
    print(f"      -> token granted: max_operations={agent2.token['max_operations']}, signed record_id={agent2.token['record_id']}")
    histories = make_stolen_card_histories(good_transactions, n=25)
    fraud_pattern = agent2.run(histories, target_count=700)
    print(f"      -> executed {agent2.executed}/{agent2.token['max_operations']} authorized transactions, producing {len(fraud_pattern)}")

    print("\n[4/4] Agent 3 (Form Breaker) requesting authorization token...")
    agent3 = FormBreakerAgent(max_attempts=1000)
    print(f"      -> token granted: max_operations={agent3.token['max_operations']}, signed record_id={agent3.token['record_id']}")
    fraud_form = agent3.run(FORM_FIELDS, target_count=240)
    print(f"      -> executed {agent3.executed}/{agent3.token['max_operations']} authorized attempts, producing {len(fraud_form)}")

    fraud_transactions = fraud_identity + fraud_pattern + fraud_form

    print("\n[confusion] Injecting realistic feature overlap (camouflaged fraud + anomalous-but-legit)...")
    good_transactions, fraud_transactions = inject_realistic_confusion(good_transactions, fraud_transactions)
    (DATA_DIR / "good_transactions.json").write_text(json.dumps(good_transactions, indent=2))
    (DATA_DIR / "fraud_transactions.json").write_text(json.dumps(fraud_transactions, indent=2))

    print(f"\nTotal fraudulent transactions generated: {len(fraud_transactions)}")
    print("Every one is traceable to a signed token that bounded how many its agent could make.")
    print(f"Wrote data/fraud_transactions.json, tokens/*_auth_token.json, tokens/*_execution_log.json")
    print("\nNext: run `python check_results.py` to train the detector and generate signed decisions.")


if __name__ == "__main__":
    main()
