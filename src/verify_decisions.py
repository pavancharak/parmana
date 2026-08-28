"""
Entry point: python verify_decisions.py [path]

Independently re-checks every signature in a decisions file (default:
decisions/mandate_decisions.json), using only the public key files in
tokens/, exactly what a judge with no access to any private key would do.
Prints a pass/fail summary and exits non-zero if anything doesn't verify.
"""

import json
import sys
from pathlib import Path

import authority_signer as auth

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PATH = ROOT / "decisions" / "mandate_decisions.json"


def verify_mandate_records(records):
    total = len(records)
    mandate_valid = sum(1 for r in records if auth.verify_record(dict(r["mandate_decision"]), "authority"))
    combined_valid = sum(1 for r in records if auth.verify_record(dict(r["combined_decision"]), "authority"))
    gate_consistent = sum(
        1
        for r in records
        if r["execution_evidence"]["execution_performed"] == (r["combined_decision"]["final_decision"] == "EXECUTE")
    )
    return {
        "total": total,
        "mandate_decisions_valid": mandate_valid,
        "combined_decisions_valid": combined_valid,
        "execution_gate_consistent": gate_consistent,
    }


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PATH
    records = json.loads(path.read_text())

    result = verify_mandate_records(records)
    print(f"Verifying {result['total']} records from {path}")
    print(f"  mandate decisions valid:  {result['mandate_decisions_valid']}/{result['total']}")
    print(f"  combined decisions valid: {result['combined_decisions_valid']}/{result['total']}")
    print(f"  execution gate consistent (execution_performed == (final_decision == EXECUTE)): {result['execution_gate_consistent']}/{result['total']}")

    ok = (
        result["mandate_decisions_valid"] == result["total"]
        and result["combined_decisions_valid"] == result["total"]
        and result["execution_gate_consistent"] == result["total"]
    )
    print("PASS" if ok else "FAIL")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
