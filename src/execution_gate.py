"""
Execution Gate.

The only place in this codebase allowed to set execution_performed to
True. Requires both a final_decision of EXECUTE AND a verifiable
authority signature on that exact combined decision — if either is
missing, execution does not happen. This is what makes "AI can assess
risk, but execution requires independent mandate approval + authority
authorization" true in code, not just in prose: a detector or mandate
engine that only reaches an internal ALLOW can never execute on its own
opinion, only a signature this module independently verifies can.
"""

import authority_signer as auth


def execute_if_approved(signed_combined_decision: dict) -> dict:
    transaction_id = signed_combined_decision.get("transaction_id")
    final_decision = signed_combined_decision.get("final_decision")

    evidence = {
        "transaction_id": transaction_id,
        "final_decision": final_decision,
        "execution_performed": False,
        "reason": "No execution",
    }

    if final_decision != "EXECUTE":
        evidence["reason"] = f"Execution gate held: final_decision={final_decision}"
        return evidence

    if not auth.verify_record(dict(signed_combined_decision), "authority"):
        evidence["reason"] = "Execution gate held: authority signature did not verify"
        return evidence

    evidence["execution_performed"] = True
    evidence["reason"] = "Executed: detection ALLOW + mandate ALLOW + authority signature verified"
    return evidence
