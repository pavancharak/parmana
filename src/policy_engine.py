"""
Deterministic Mandate Engine.

Independent of fraud_detector.py: no shared state, no ML, no network
calls, no randomness. Given the same policy snapshot and the same
transaction, evaluate() always returns the same decision — that
determinism is what makes this a mandate rather than another opinion.

The detector answers "does this look like fraud?". This module answers a
different question entirely: "is this transaction permitted under our
business policy, regardless of what the detector thinks?" A $0.01
transaction from a merchant we've blocked is not fraud, but it still
should not execute. Keeping the two independent means a compromised or
mistaken detector can't talk its way past the mandate, and vice versa.
"""

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POLICY_PATH = ROOT / "policy" / "mandate_policy.json"

ALLOW = "ALLOW"
BLOCK = "BLOCK"
REQUIRES_APPROVAL = "REQUIRES_APPROVAL"


def load_policy() -> dict:
    return json.loads(POLICY_PATH.read_text())


def policy_hash(policy: dict) -> str:
    """Deterministic fingerprint of the policy snapshot used for a
    decision, so a judge can confirm which exact policy version produced
    it without trusting a version string alone."""
    canonical = json.dumps(policy, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return f"sha256:{hashlib.sha256(canonical).hexdigest()}"


def evaluate(transaction: dict, policy: dict) -> dict:
    """Evaluate one transaction against one policy snapshot. Fail-closed:
    a malformed transaction or any rule violation blocks; only a
    transaction that passes every check, and stays under the approval
    threshold, is ALLOWed."""
    transaction_id = transaction.get("transaction_id")
    if not transaction_id:
        return _result(BLOCK, ["INVALID_TRANSACTION"], policy, "unknown")

    reasons = []
    amount = transaction.get("amount")
    if not isinstance(amount, (int, float)) or isinstance(amount, bool) or amount < 0:
        reasons.append("INVALID_TRANSACTION")
    elif amount > policy["max_transaction_amount"]:
        reasons.append("AMOUNT_EXCEEDS_LIMIT")

    currency = transaction.get("currency")
    if currency not in policy["allowed_currencies"]:
        reasons.append("CURRENCY_NOT_ALLOWED")

    merchant = transaction.get("merchant")
    if merchant in policy.get("blocked_merchants", []):
        reasons.append("MERCHANT_BLOCKED")

    if reasons:
        return _result(BLOCK, sorted(set(reasons)), policy, transaction_id)

    approval_threshold = policy.get("require_approval_above")
    if approval_threshold is not None and amount > approval_threshold:
        return _result(REQUIRES_APPROVAL, ["APPROVAL_REQUIRED"], policy, transaction_id)

    return _result(ALLOW, [], policy, transaction_id)


def _result(decision, reason_codes, policy, transaction_id):
    return {
        "record_type": "mandate_decision",
        "transaction_id": transaction_id,
        "decision": decision,
        "reason_codes": reason_codes,
        "policy_id": policy["policy_id"],
        "policy_version": str(policy["policy_version"]),
        "policy_hash": policy_hash(policy),
    }
