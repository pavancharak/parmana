"""
Decision Combiner.

Merges the detector's decision with the Mandate Engine's decision into one
final governance verdict. Fail-closed: the most restrictive input always
wins, and any input this module doesn't recognize blocks rather than
passes through.

    Detection   Mandate              Final
    ---------------------------------------------
    ALLOW       ALLOW                EXECUTE
    ALLOW       REQUIRES_APPROVAL    NO_EXECUTION
    FLAG        (any)                NO_EXECUTION
    (any)       BLOCK                BLOCK
    BLOCK       (any)                BLOCK

Only ALLOW + ALLOW can execute. Everything else holds or blocks.
"""

EXECUTE = "EXECUTE"
BLOCK = "BLOCK"
NO_EXECUTION = "NO_EXECUTION"

_KNOWN_DETECTION = {"ALLOW", "FLAG", "BLOCK"}
_KNOWN_MANDATE = {"ALLOW", "BLOCK", "REQUIRES_APPROVAL"}


def combine(detection_decision: str, mandate_decision: str) -> dict:
    if detection_decision not in _KNOWN_DETECTION or mandate_decision not in _KNOWN_MANDATE:
        return _result(NO_EXECUTION, detection_decision, mandate_decision, "Unrecognized governance input")

    if detection_decision == "BLOCK" or mandate_decision == "BLOCK":
        return _result(BLOCK, detection_decision, mandate_decision, "Detector or mandate blocked the transaction")

    if detection_decision == "FLAG" or mandate_decision == "REQUIRES_APPROVAL":
        return _result(NO_EXECUTION, detection_decision, mandate_decision, "Held for human review")

    return _result(EXECUTE, detection_decision, mandate_decision, "Detection and mandate both approved")


def _result(final_decision, detection_decision, mandate_decision, reason):
    return {
        "record_type": "combined_decision",
        "final_decision": final_decision,
        "detection_decision": detection_decision,
        "mandate_decision": mandate_decision,
        "reason": reason,
    }
