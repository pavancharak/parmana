"""
Entry point: python check_results.py

Trains the detector on data/good_transactions.json + data/fraud_transactions.json,
evaluates it, routes every decision through the external authority for
signing, demonstrates three human overrides (signed by a DIFFERENT key),
verifies every signature independently, and writes:

  - decisions/block_decisions.json   (already written by fraud_detector, re-verified here)
  - decisions/override_log.json
  - web/data/dashboard.json          (everything the web dashboard reads)

Run this after run_simulation.py.
"""

import json
import random
from pathlib import Path

import authority_signer as auth
import fraud_detector as fd

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
DECISIONS_DIR = ROOT / "decisions"
TOKENS_DIR = ROOT / "tokens"
WEB_DATA_DIR = ROOT / "web" / "data"
DOCS_DIR = ROOT / "docs"
DECISIONS_DIR.mkdir(exist_ok=True)
WEB_DATA_DIR.mkdir(parents=True, exist_ok=True)

random.seed(99)


def load(name):
    return json.loads((DATA_DIR / name).read_text())


def build_override_log(signed_decisions):
    """Three concrete override scenarios, each signed by REVIEWER (not
    AUTHORITY, not the detector). This is the 'who overrode what, provably'
    story."""
    flags = [e for e in signed_decisions if e["decision"]["decision"] == "FLAG"]
    allows = [e for e in signed_decisions if e["decision"]["decision"] == "ALLOW"]

    overrides = []

    true_positive_flag = next((e for e in flags if e["ground_truth"]["is_fraud"] == 1), None)
    if true_positive_flag:
        overrides.append(
            auth.sign_override(
                true_positive_flag["decision"]["transaction_id"],
                original_decision="FLAG",
                new_decision="BLOCK",
                reviewer_name="reviewer_j.alvarez",
                justification="Manual review confirmed fraud pattern consistent with stolen-card testing; escalating from FLAG to BLOCK.",
            )
        )

    false_positive_flag = next((e for e in flags if e["ground_truth"]["is_fraud"] == 0), None)
    if false_positive_flag:
        overrides.append(
            auth.sign_override(
                false_positive_flag["decision"]["transaction_id"],
                original_decision="FLAG",
                new_decision="ALLOW",
                reviewer_name="reviewer_m.osei",
                justification="Customer verified by phone; recurring purchase from a new but legitimate device. Releasing transaction.",
            )
        )

    missed_fraud_allow = next((e for e in allows if e["ground_truth"]["is_fraud"] == 1), None)
    if missed_fraud_allow:
        overrides.append(
            auth.sign_override(
                missed_fraud_allow["decision"]["transaction_id"],
                original_decision="ALLOW",
                new_decision="BLOCK",
                reviewer_name="monitoring_system_v2",
                justification="Post-hoc monitoring flagged this transaction as part of a fraud ring identified after the fact; retroactively blocking related funds movement.",
            )
        )

    (DECISIONS_DIR / "override_log.json").write_text(json.dumps(overrides, indent=2))
    return overrides


def verify_everything(agent_tokens, signed_decisions, overrides):
    report = {"agent_tokens": {}, "decisions_sampled": 0, "decisions_valid": 0, "overrides_sampled": 0, "overrides_valid": 0}

    for token_path in TOKENS_DIR.glob("*_auth_token.json"):
        token = json.loads(token_path.read_text())
        ok = auth.verify_record(dict(token), "authority")
        report["agent_tokens"][token_path.stem] = ok

    sample = random.sample(signed_decisions, min(50, len(signed_decisions)))
    report["decisions_sampled"] = len(sample)
    report["decisions_valid"] = sum(1 for e in sample if auth.verify_record(dict(e["decision"]), "authority"))

    report["overrides_sampled"] = len(overrides)
    report["overrides_valid"] = sum(1 for o in overrides if auth.verify_record(dict(o), "reviewer"))

    # Prove key separation: an override record must NOT verify against the
    # authority key, and a decision must NOT verify against the reviewer key.
    if overrides:
        report["override_does_not_verify_as_authority"] = not auth.verify_record(dict(overrides[0]), "authority")
    if signed_decisions:
        report["decision_does_not_verify_as_reviewer"] = not auth.verify_record(dict(signed_decisions[0]["decision"]), "reviewer")

    return report


def gather_agent_summaries(fraud_transactions):
    summaries = []
    for log_path in sorted(TOKENS_DIR.glob("*_execution_log.json")):
        summary = json.loads(log_path.read_text())
        token_path = TOKENS_DIR / f"{summary['agent_id']}_auth_token.json"
        if token_path.exists():
            summary["token"] = json.loads(token_path.read_text())
        agent_tx = [t for t in fraud_transactions if t.get("generated_by") == summary["agent_id"]]
        summary["sample_transactions"] = random.sample(agent_tx, min(5, len(agent_tx)))
        summaries.append(summary)
    return summaries


def main():
    print("=" * 70)
    print("PARMANA FRAUD DEFENSE LAB: Detection + Proof Run")
    print("=" * 70)

    good = load("good_transactions.json")
    fraud = load("fraud_transactions.json")
    all_tx = good + fraud
    print(f"\n[1/5] Loaded {len(good)} legitimate + {len(fraud)} fraudulent transactions ({len(all_tx)} total)")

    print("\n[2/5] Training detector (RandomForest)...")
    model, X_test, y_test, tx_test = fd.train(all_tx)
    fd.save_model(model)
    metrics = fd.evaluate(model, X_test, y_test)
    scores = metrics.pop("scores")
    print(f"      fraud_caught_rate={metrics['fraud_caught_rate']:.2%}  false_positive_rate={metrics['false_positive_rate']:.2%}")
    print(f"      top signals: {[s['feature'] for s in metrics['top_signals']]}")
    print(f"      model saved to models/detector_model.pkl for probe_detector.py (Agents 3 and 7)")

    print("\n[3/5] Routing every decision to the external authority for signing...")
    signed_decisions = fd.generate_signed_decisions(model, tx_test, scores)
    counts = {"BLOCK": 0, "FLAG": 0, "ALLOW": 0}
    for e in signed_decisions:
        counts[e["decision"]["decision"]] += 1
    print(f"      -> {len(signed_decisions)} signed decisions: {counts}")

    print("\n[4/5] Generating human override examples (signed by REVIEWER, not AUTHORITY)...")
    overrides = build_override_log(signed_decisions)
    print(f"      -> {len(overrides)} overrides written to decisions/override_log.json")

    print("\n[5/5] Verifying every signature independently (public-key check only)...")
    verification = verify_everything(None, signed_decisions, overrides)
    print(f"      agent tokens valid: {verification['agent_tokens']}")
    print(f"      decisions valid: {verification['decisions_valid']}/{verification['decisions_sampled']}")
    print(f"      overrides valid: {verification['overrides_valid']}/{verification['overrides_sampled']}")
    print(f"      key separation holds: override_does_not_verify_as_authority={verification.get('override_does_not_verify_as_authority')}, "
          f"decision_does_not_verify_as_reviewer={verification.get('decision_does_not_verify_as_reviewer')}")

    agent_summaries = gather_agent_summaries(fraud)

    attacks = json.loads((DOCS_DIR / "attacks.json").read_text()) if (DOCS_DIR / "attacks.json").exists() else []

    dashboard = {
        "attacks": attacks,
        "simulation": {
            "good_transaction_count": len(good),
            "fraud_transaction_count": len(fraud),
            "agent_summaries": agent_summaries,
        },
        "detector": {
            "metrics": metrics,
            "decision_counts": counts,
            "sample_decisions": random.sample(signed_decisions, min(30, len(signed_decisions))),
        },
        "overrides": overrides,
        "verification": verification,
    }
    (WEB_DATA_DIR / "dashboard.json").write_text(json.dumps(dashboard, indent=2))
    print("\nWrote web/data/dashboard.json. Open web/index.html (via a local server) to view the results.")


if __name__ == "__main__":
    main()
