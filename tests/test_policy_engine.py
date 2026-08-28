"""Tests for the deterministic Mandate Engine (src/policy_engine.py)."""

import policy_engine as pe

POLICY = {
    "policy_id": "test-policy",
    "policy_version": "1",
    "max_transaction_amount": 5000,
    "allowed_currencies": ["USD", "EUR"],
    "blocked_merchants": ["ShadyMart"],
    "require_approval_above": 2500,
}


def test_allow_valid_transaction():
    transaction = {"transaction_id": "tx-001", "amount": 1000, "currency": "USD", "merchant": "QuickMart"}
    result = pe.evaluate(transaction, POLICY)
    assert result["decision"] == pe.ALLOW
    assert result["reason_codes"] == []


def test_block_amount_exceeds():
    transaction = {"transaction_id": "tx-002", "amount": 10000, "currency": "USD", "merchant": "QuickMart"}
    result = pe.evaluate(transaction, POLICY)
    assert result["decision"] == pe.BLOCK
    assert "AMOUNT_EXCEEDS_LIMIT" in result["reason_codes"]


def test_block_unsupported_currency():
    transaction = {"transaction_id": "tx-003", "amount": 1000, "currency": "JPY", "merchant": "QuickMart"}
    result = pe.evaluate(transaction, POLICY)
    assert result["decision"] == pe.BLOCK
    assert "CURRENCY_NOT_ALLOWED" in result["reason_codes"]


def test_block_blocked_merchant():
    transaction = {"transaction_id": "tx-004", "amount": 1000, "currency": "USD", "merchant": "ShadyMart"}
    result = pe.evaluate(transaction, POLICY)
    assert result["decision"] == pe.BLOCK
    assert "MERCHANT_BLOCKED" in result["reason_codes"]


def test_requires_approval():
    transaction = {"transaction_id": "tx-005", "amount": 3000, "currency": "USD", "merchant": "QuickMart"}
    result = pe.evaluate(transaction, POLICY)
    assert result["decision"] == pe.REQUIRES_APPROVAL
    assert result["reason_codes"] == ["APPROVAL_REQUIRED"]


def test_fail_closed_missing_transaction_id():
    transaction = {"amount": 1000, "currency": "USD", "merchant": "QuickMart"}
    result = pe.evaluate(transaction, POLICY)
    assert result["decision"] == pe.BLOCK
    assert result["reason_codes"] == ["INVALID_TRANSACTION"]


def test_fail_closed_negative_amount():
    transaction = {"transaction_id": "tx-006", "amount": -50, "currency": "USD", "merchant": "QuickMart"}
    result = pe.evaluate(transaction, POLICY)
    assert result["decision"] == pe.BLOCK
    assert "INVALID_TRANSACTION" in result["reason_codes"]


def test_fail_closed_injection_scale_amount():
    """The real fraud data contains injection payloads that parse to
    extreme floats (e.g. '9'*20 -> ~1e19). The policy must block these on
    amount alone, independent of whatever the ML detector scores them."""
    transaction = {"transaction_id": "tx-007", "amount": 9.9e19, "currency": "USD", "merchant": "QuickMart"}
    result = pe.evaluate(transaction, POLICY)
    assert result["decision"] == pe.BLOCK
    assert "AMOUNT_EXCEEDS_LIMIT" in result["reason_codes"]


def test_deterministic_replay():
    transaction = {"transaction_id": "tx-008", "amount": 1500, "currency": "USD", "merchant": "QuickMart"}
    results = [pe.evaluate(transaction, POLICY) for _ in range(10)]
    for result in results:
        assert result["decision"] == results[0]["decision"]
        assert result["reason_codes"] == results[0]["reason_codes"]
        assert result["policy_hash"] == results[0]["policy_hash"]


def test_policy_hash_changes_with_policy():
    other_policy = dict(POLICY, max_transaction_amount=9999)
    h1 = pe.policy_hash(POLICY)
    h2 = pe.policy_hash(other_policy)
    assert h1 != h2
