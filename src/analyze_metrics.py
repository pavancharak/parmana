"""
Entry point: python analyze_metrics.py

Runs the real pipeline (run_simulation.py + check_results.py) 5 times in a
row and records the actual detector metrics from each run, to measure how
much they vary. Agents 1, 2, and 4 call the real OpenAI API at
temperature=0.9, so the generated fraud data differs every run, and the
detector's catch/miss/false-positive rates move with it. This script
turns that from an assumption into a measured distribution.

Deliberately does not call probe_detector.py each cycle: Agents 3 and 7
don't affect the detector's own catch/miss/FPR numbers, and skipping them
keeps each cycle faster and cheaper without losing what we're measuring.

Reads web/data/dashboard.json after each check_results.py run, since
that's the real, single source of truth this whole project already uses,
not a "summary" key that doesn't exist in decisions/block_decisions.json.
"""

import json
import subprocess
import time
from pathlib import Path
from statistics import mean, stdev

ROOT = Path(__file__).resolve().parent.parent
DASHBOARD_PATH = ROOT / "web" / "data" / "dashboard.json"

N_RUNS = 5
results = []

for run_num in range(1, N_RUNS + 1):
    print(f"\n{'=' * 60}")
    print(f"RUN {run_num}/{N_RUNS}")
    print("=" * 60)

    print("Generating fraud attacks (real OpenAI calls)...")
    subprocess.run(["python", "run_simulation.py"], check=True)

    print("Training detector and signing decisions...")
    subprocess.run(["python", "check_results.py"], check=True)

    dashboard = json.loads(DASHBOARD_PATH.read_text())
    m = dashboard["detector"]["metrics"]
    total = dashboard["simulation"]["fraud_transaction_count"]
    good = dashboard["simulation"]["good_transaction_count"]
    counts = dashboard["detector"]["decision_counts"]

    result = {
        "run": run_num,
        "total_fraud_records": total,
        "good_records": good,
        "catch_pct": round(m["fraud_caught_rate"] * 100, 2),
        "miss_pct": round(m["fraud_missed_rate"] * 100, 2),
        "fp_rate_pct": round(m["false_positive_rate"] * 100, 2),
        "block": counts["BLOCK"],
        "flag": counts["FLAG"],
        "allow": counts["ALLOW"],
    }
    results.append(result)

    print(f"\n  Fraud records generated: {total}")
    print(f"  Caught: {result['catch_pct']}%")
    print(f"  Missed: {result['miss_pct']}%")
    print(f"  False positive rate: {result['fp_rate_pct']}%")

    if run_num < N_RUNS:
        print("\n  Cooldown...")
        time.sleep(5)

print(f"\n{'=' * 60}")
print("DISTRIBUTION ACROSS 5 REAL RUNS")
print("=" * 60)

catch_rates = [r["catch_pct"] for r in results]
miss_rates = [r["miss_pct"] for r in results]
fp_rates = [r["fp_rate_pct"] for r in results]


def stats(values):
    return {
        "min": min(values),
        "max": max(values),
        "mean": round(mean(values), 2),
        "std_dev": round(stdev(values), 2) if len(values) > 1 else None,
    }


summary = {
    "catch_rate_pct": stats(catch_rates),
    "miss_rate_pct": stats(miss_rates),
    "fp_rate_pct": stats(fp_rates),
}

print(f"\nCatch rate (%): {catch_rates}")
print(f"  {summary['catch_rate_pct']}")
print(f"\nMiss rate (%): {miss_rates}")
print(f"  {summary['miss_rate_pct']}")
print(f"\nFP rate (%): {fp_rates}")
print(f"  {summary['fp_rate_pct']}")

output = {"runs": results, "summary": summary}
out_path = ROOT / "metrics_distribution.json"
out_path.write_text(json.dumps(output, indent=2))
print(f"\nWrote {out_path}")
