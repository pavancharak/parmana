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
import decision_combiner
import execution_gate
import fraud_detector as fd
import llm_client
import policy_engine

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


def run_mandate_pipeline(signed_decisions, policy):
    """For every already-signed detection decision, independently
    evaluate the Mandate Engine, combine the two into one final verdict,
    have the authority sign that verdict, and run it through the
    execution gate. Nothing here reads the detector's model or score,
    only its ALLOW/FLAG/BLOCK output, keeping the mandate check genuinely
    independent of fraud_detector.py."""
    records = []
    for entry in signed_decisions:
        transaction = {
            "transaction_id": entry["decision"]["transaction_id"],
            "amount": entry["ground_truth"]["amount"],
            "currency": entry["ground_truth"]["currency"],
            "merchant": entry["ground_truth"]["merchant"],
        }
        detection_decision = entry["decision"]["decision"]

        mandate_result = policy_engine.evaluate(transaction, policy)
        signed_mandate = auth.sign_mandate_decision(mandate_result)

        combined = decision_combiner.combine(detection_decision, mandate_result["decision"])
        signed_combined = auth.sign_combined_decision(
            transaction["transaction_id"],
            combined["final_decision"],
            combined["detection_decision"],
            combined["mandate_decision"],
            combined["reason"],
        )

        evidence = execution_gate.execute_if_approved(signed_combined)

        records.append(
            {
                "transaction_id": transaction["transaction_id"],
                "mandate_decision": signed_mandate,
                "combined_decision": signed_combined,
                "execution_evidence": evidence,
            }
        )

    path = DECISIONS_DIR / "mandate_decisions.json"
    path.write_text(json.dumps(records, indent=2))
    return records


def verify_everything(agent_tokens, signed_decisions, overrides, mandate_records=None):
    report = {"agent_tokens": {}, "decisions_sampled": 0, "decisions_valid": 0, "overrides_sampled": 0, "overrides_valid": 0}

    for token_path in TOKENS_DIR.glob("*_auth_token.json"):
        token = json.loads(token_path.read_text())
        ok = auth.verify_record(dict(token), "authority")
        report["agent_tokens"][token_path.stem] = ok

    # Every signed decision gets checked, not a sample. Signature
    # verification is a local Ed25519 check, cheap and fast, there's no
    # reason to only sample it the way we sample for display purposes.
    report["decisions_sampled"] = len(signed_decisions)
    report["decisions_valid"] = sum(1 for e in signed_decisions if auth.verify_record(dict(e["decision"]), "authority"))

    report["overrides_sampled"] = len(overrides)
    report["overrides_valid"] = sum(1 for o in overrides if auth.verify_record(dict(o), "reviewer"))

    # Prove key separation: an override record must NOT verify against the
    # authority key, and a decision must NOT verify against the reviewer key.
    if overrides:
        report["override_does_not_verify_as_authority"] = not auth.verify_record(dict(overrides[0]), "authority")
    if signed_decisions:
        report["decision_does_not_verify_as_reviewer"] = not auth.verify_record(dict(signed_decisions[0]["decision"]), "reviewer")

    if mandate_records:
        report["mandate_decisions_sampled"] = len(mandate_records)
        report["mandate_decisions_valid"] = sum(
            1 for r in mandate_records if auth.verify_record(dict(r["mandate_decision"]), "authority")
        )
        report["combined_decisions_sampled"] = len(mandate_records)
        report["combined_decisions_valid"] = sum(
            1 for r in mandate_records if auth.verify_record(dict(r["combined_decision"]), "authority")
        )
        # Prove the execution gate never sets execution_performed=True
        # without final_decision == EXECUTE, on the actual run output.
        report["execution_gate_fail_closed"] = all(
            r["execution_evidence"]["execution_performed"] == (r["combined_decision"]["final_decision"] == "EXECUTE")
            for r in mandate_records
        )

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
    print(f"\n[1/6] Loaded {len(good)} legitimate + {len(fraud)} fraudulent transactions ({len(all_tx)} total)")

    print("\n[2/6] Training detector (RandomForest)...")
    model, X_test, y_test, tx_test = fd.train(all_tx)
    fd.save_model(model)
    metrics = fd.evaluate(model, X_test, y_test)
    scores = metrics.pop("scores")
    print(f"      fraud_caught_rate={metrics['fraud_caught_rate']:.2%}  false_positive_rate={metrics['false_positive_rate']:.2%}")
    print(f"      top signals: {[s['feature'] for s in metrics['top_signals']]}")
    print(f"      model saved to models/detector_model.pkl for probe_detector.py (Agents 3 and 7)")

    print("\n[3/6] Routing every decision to the external authority for signing...")
    signed_decisions = fd.generate_signed_decisions(model, tx_test, scores)
    counts = {"BLOCK": 0, "FLAG": 0, "ALLOW": 0}
    for e in signed_decisions:
        counts[e["decision"]["decision"]] += 1
    print(f"      -> {len(signed_decisions)} signed decisions: {counts}")

    print("\n[4/6] Independently evaluating the Mandate Engine (deterministic, no ML) against every decision...")
    policy = policy_engine.load_policy()
    mandate_records = run_mandate_pipeline(signed_decisions, policy)
    final_counts = {"EXECUTE": 0, "BLOCK": 0, "NO_EXECUTION": 0}
    for r in mandate_records:
        final_counts[r["combined_decision"]["final_decision"]] += 1
    executed = sum(1 for r in mandate_records if r["execution_evidence"]["execution_performed"])
    print(f"      -> policy {policy['policy_id']} v{policy['policy_version']} ({policy_engine.policy_hash(policy)})")
    print(f"      -> final verdicts: {final_counts}  (execution_performed=True for {executed})")

    print("\n[5/6] Generating human override examples (signed by REVIEWER, not AUTHORITY)...")
    overrides = build_override_log(signed_decisions)
    print(f"      -> {len(overrides)} overrides written to decisions/override_log.json")

    print("\n[6/6] Verifying every signature independently (public-key check only)...")
    verification = verify_everything(None, signed_decisions, overrides, mandate_records)
    print(f"      agent tokens valid: {verification['agent_tokens']}")
    print(f"      decisions valid: {verification['decisions_valid']}/{verification['decisions_sampled']}")
    print(f"      overrides valid: {verification['overrides_valid']}/{verification['overrides_sampled']}")
    print(f"      mandate decisions valid: {verification['mandate_decisions_valid']}/{verification['mandate_decisions_sampled']}")
    print(f"      combined decisions valid: {verification['combined_decisions_valid']}/{verification['combined_decisions_sampled']}")
    print(f"      execution gate fail-closed on this run: {verification['execution_gate_fail_closed']}")
    print(f"      key separation holds: override_does_not_verify_as_authority={verification.get('override_does_not_verify_as_authority')}, "
          f"decision_does_not_verify_as_reviewer={verification.get('decision_does_not_verify_as_reviewer')}")

    agent_summaries = gather_agent_summaries(fraud)

    attacks = json.loads((DOCS_DIR / "attacks.json").read_text()) if (DOCS_DIR / "attacks.json").exists() else []

    attack_type_breakdown = {}
    for tx in fraud:
        key = tx.get("attack_type", "none")
        attack_type_breakdown[key] = attack_type_breakdown.get(key, 0) + 1

    missed_fraud_sample = [
        e for e in signed_decisions
        if e["ground_truth"]["is_fraud"] == 1 and e["decision"]["decision"] == "ALLOW"
    ]
    missed_fraud_sample = random.sample(missed_fraud_sample, min(5, len(missed_fraud_sample)))

    dashboard = {
        "attacks": attacks,
        "api_activity": llm_client.load_log_summary(),
        "simulation": {
            "good_transaction_count": len(good),
            "fraud_transaction_count": len(fraud),
            "agent_summaries": agent_summaries,
            "attack_type_breakdown": attack_type_breakdown,
        },
        "detector": {
            "metrics": metrics,
            "decision_counts": counts,
            "sample_decisions": random.sample(signed_decisions, min(30, len(signed_decisions))),
            "missed_fraud_sample": missed_fraud_sample,
        },
        "overrides": overrides,
        "verification": verification,
        "governance": {
            "policy": policy,
            "policy_hash": policy_engine.policy_hash(policy),
            "final_decision_counts": final_counts,
            "executed_count": executed,
            "sample_mandate_records": random.sample(mandate_records, min(30, len(mandate_records))),
        },
    }
    (WEB_DATA_DIR / "dashboard.json").write_text(json.dumps(dashboard, indent=2))
    print("\nWrote web/data/dashboard.json. Open web/index.html (via a local server) to view the results.")


if __name__ == "__main__":
    main()
