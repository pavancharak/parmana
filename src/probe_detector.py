"""
Entry point: python probe_detector.py

Phase 2: red-teams our OWN trained detector. Run this after
check_results.py has trained and saved a model.

Agent 3 (Limit Prober): submits amounts $10 to $10000 through the real
detector, holding every other feature at the legitimate population's
median, and reads back the real decision boundary. No external API, no
fabricated "Mastercard sandbox", just our own model.

Agent 7 (Feedback Loop Exploit): samples transactions our detector
actually blocked, asks GPT to propose small realistic feature variants,
and re-scores each variant through the real detector to see which ones
actually evade. Genuine adversarial robustness testing against our own
local model.

Both reports are signed by the external authority and written to
decisions/probe_report.json, and merged into web/data/dashboard.json
under "redteam" so the dashboard's Red Team tab can show them.
"""

import json
from pathlib import Path

import authority_signer as auth
import fraud_detector as fd
import llm_client
from fraud_agents import LimitProberAgent, FeedbackLoopAgent

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
DECISIONS_DIR = ROOT / "decisions"
WEB_DATA_DIR = ROOT / "web" / "data"

def _probe_amount_range(n=175, lo=10, hi=10000):
    step = (hi - lo) / (n - 1)
    return [round(lo + step * i, 2) for i in range(n)]


PROBE_AMOUNTS = _probe_amount_range(175)


def load(name):
    return json.loads((DATA_DIR / name).read_text())


def build_blocked_sample(model, n=5):
    """Pull real blocked transactions and join back to their raw feature
    values so Agent 7 has real numbers to work from, not just the signed
    decision's summary fields. Sampled closest to the 0.80 BLOCK threshold
    on purpose: those are the genuinely testable cases. The highest-
    confidence blocks (score ~0.98, extreme feature values) are trivially
    robust to small nudges, testing those would make evasion look
    artificially hard rather than showing a real adversarial result."""
    decisions = json.loads((DECISIONS_DIR / "block_decisions.json").read_text())
    blocked = [e for e in decisions if e["decision"]["decision"] == "BLOCK"]
    blocked.sort(key=lambda e: abs(e["decision"]["fraud_score"] - 0.80))

    by_id = {t["transaction_id"]: t for t in load("fraud_transactions.json") + load("good_transactions.json")}

    sample = []
    for entry in blocked[: n * 2]:
        tx_id = entry["decision"]["transaction_id"]
        tx = by_id.get(tx_id)
        if tx is None:
            continue
        sample.append({
            "transaction_id": tx_id,
            "score": entry["decision"]["fraud_score"],
            "amount": tx["amount"],
            "hour_of_day": tx["hour_of_day"],
            "seconds_since_prev_tx": tx["seconds_since_prev_tx"],
            "location_mismatch_km": tx["location_mismatch_km"],
            "pattern_similarity": tx["pattern_similarity"],
            "ai_generated_signal": tx["ai_generated_signal"],
        })
        if len(sample) >= n:
            break
    return sample


def main():
    print("=" * 70)
    print("PARMANA FRAUD DEFENSE LAB: Red Team Run (Agents 3 and 7)")
    print("=" * 70)

    model = fd.load_model()
    good = load("good_transactions.json")
    neutral_features = fd.median_neutral_features(good)

    print("\n[1/2] Agent 3 (Limit Prober, real: tests OUR trained detector) requesting token...")
    agent3 = LimitProberAgent(PROBE_AMOUNTS)
    print(f"      -> token granted: max_operations={agent3.token['max_operations']}, signed record_id={agent3.token['record_id']}")
    probe_results = agent3.run(neutral_features, model, fd.decision_for_score)
    threshold = next((r["amount"] for r in probe_results if r["decision"] == "BLOCK"), None)
    for r in probe_results[::25]:
        print(f"      ${r['amount']:>9,.2f}: score={r['score']:.3f} -> {r['decision']}")
    print(f"      ... {len(probe_results)} amounts tested in total, every 25th shown above")
    print(f"      -> detector starts blocking at ${threshold}" if threshold else "      -> no amount alone triggered BLOCK")

    print("\n[2/2] Agent 7 (Feedback Loop Exploit, real: GPT + OUR trained detector) requesting token...")
    blocked_sample = build_blocked_sample(model, n=25)
    agent7 = FeedbackLoopAgent(max_variants=175)
    print(f"      -> token granted: max_operations={agent7.token['max_operations']}, signed record_id={agent7.token['record_id']}")
    print(f"      -> sampling {len(blocked_sample)} real blocked transactions, asking GPT for evasion variants...")
    evasion_results = agent7.run(blocked_sample, model, fd.decision_for_score, variants_per_tx=7)
    evaded_count = sum(1 for r in evasion_results if r["evaded"])
    print(f"      -> tested {len(evasion_results)} variants, {evaded_count} evaded detection")

    print("\nSigning both reports with the external authority...")
    signed_probe = auth.AUTHORITY.sign_record({
        "record_type": "limit_probe_report",
        "amounts_tested": [r["amount"] for r in probe_results],
        "results": probe_results,
        "threshold_amount": threshold,
    })
    signed_evasion = auth.AUTHORITY.sign_record({
        "record_type": "feedback_loop_report",
        "variants_tested": len(evasion_results),
        "variants_evaded": evaded_count,
        "results": evasion_results,
    })

    probe_report = {"limit_probe": signed_probe, "feedback_loop": signed_evasion}
    (DECISIONS_DIR / "probe_report.json").write_text(json.dumps(probe_report, indent=2))

    probe_valid = auth.verify_record(dict(signed_probe), "authority")
    evasion_valid = auth.verify_record(dict(signed_evasion), "authority")
    print(f"Signature check: limit_probe_report valid={probe_valid}, feedback_loop_report valid={evasion_valid}")

    dashboard_path = WEB_DATA_DIR / "dashboard.json"
    dashboard = json.loads(dashboard_path.read_text()) if dashboard_path.exists() else {}
    dashboard["redteam"] = {
        "limit_probe": signed_probe,
        "feedback_loop": signed_evasion,
        "verification": {"limit_probe_valid": probe_valid, "feedback_loop_valid": evasion_valid},
    }
    # Refresh the API activity log now that Agent 7's calls are in it too,
    # not just the ones check_results.py saw before this script ran.
    dashboard["api_activity"] = llm_client.load_log_summary()
    # metrics_distribution.json is a one-off artifact from analyze_metrics.py
    # (5 independent full runs), not regenerated by the normal pipeline, so
    # carry it forward here rather than losing it on the next check_results.py.
    dist_path = ROOT / "metrics_distribution.json"
    if dist_path.exists():
        dashboard["distribution"] = json.loads(dist_path.read_text())
    dashboard_path.write_text(json.dumps(dashboard, indent=2))

    totals = llm_client.session_totals()
    print(f"\nOpenAI usage this run: {totals['calls']} calls, ~${totals['estimated_cost_usd']:.4f} estimated")
    print("Wrote decisions/probe_report.json and merged results into web/data/dashboard.json (redteam).")


if __name__ == "__main__":
    main()
