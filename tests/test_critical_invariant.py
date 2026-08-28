"""
CRITICAL PROOF TEST: AI cannot authorize execution alone.

Detector = ALLOW, Mandate = BLOCK -> Final = BLOCK -> execution NOT
performed, and this holds through the real signed pipeline: the Mandate
Engine's decision, the combined verdict, and the execution gate's refusal
are all backed by an Ed25519 signature anyone can verify with the public
key in tokens/authority_public_key.pem.
"""

import authority_signer as auth
import decision_combiner as dc
import execution_gate as eg
import policy_engine as pe

POLICY = {
    "policy_id": "critical-test",
    "policy_version": "1",
    "max_transaction_amount": 1000,
    "allowed_currencies": ["USD"],
    "blocked_merchants": [],
    "require_approval_above": 500,
}


def test_detector_allow_mandate_block_blocks_execution():
    transaction = {
        "transaction_id": "tx-critical-001",
        "amount": 5000,  # exceeds the policy's max_transaction_amount
        "currency": "USD",
        "merchant": "QuickMart",
    }

    # The detector's opinion, simulated: it thinks this is fine.
    detection_decision = "ALLOW"

    # The mandate engine is evaluated completely independently.
    mandate_result = pe.evaluate(transaction, POLICY)
    assert mandate_result["decision"] == "BLOCK"
    assert "AMOUNT_EXCEEDS_LIMIT" in mandate_result["reason_codes"]
    signed_mandate = auth.sign_mandate_decision(mandate_result)
    assert auth.verify_record(dict(signed_mandate), "authority")

    # Combine: detector ALLOW + mandate BLOCK.
    combined = dc.combine(detection_decision, mandate_result["decision"])
    assert combined["final_decision"] == dc.BLOCK

    signed_combined = auth.sign_combined_decision(
        transaction["transaction_id"],
        combined["final_decision"],
        combined["detection_decision"],
        combined["mandate_decision"],
        combined["reason"],
    )
    assert auth.verify_record(dict(signed_combined), "authority")

    # The execution gate must refuse to execute.
    evidence = eg.execute_if_approved(signed_combined)
    assert evidence["execution_performed"] is False
    assert evidence["final_decision"] == "BLOCK"


def test_detector_allow_mandate_allow_executes_only_with_valid_signature():
    """The positive case, and proof the gate actually checks the
    signature rather than trusting the final_decision label: a tampered
    combined decision claiming EXECUTE must still be refused."""
    transaction = {
        "transaction_id": "tx-critical-002",
        "amount": 100,
        "currency": "USD",
        "merchant": "QuickMart",
    }

    mandate_result = pe.evaluate(transaction, POLICY)
    assert mandate_result["decision"] == "ALLOW"

    combined = dc.combine("ALLOW", mandate_result["decision"])
    assert combined["final_decision"] == dc.EXECUTE

    signed_combined = auth.sign_combined_decision(
        transaction["transaction_id"],
        combined["final_decision"],
        combined["detection_decision"],
        combined["mandate_decision"],
        combined["reason"],
    )
    evidence = eg.execute_if_approved(signed_combined)
    assert evidence["execution_performed"] is True

    # Now take a legitimately BLOCK-signed record and tamper its
    # final_decision to claim EXECUTE. The signature was computed over
    # the original body, so it no longer verifies against the edited one.
    blocked = dc.combine("ALLOW", "BLOCK")
    signed_blocked = auth.sign_combined_decision(
        transaction["transaction_id"],
        blocked["final_decision"],
        blocked["detection_decision"],
        blocked["mandate_decision"],
        blocked["reason"],
    )
    forged = dict(signed_blocked)
    forged["final_decision"] = "EXECUTE"
    tampered_evidence = eg.execute_if_approved(forged)
    assert tampered_evidence["execution_performed"] is False
