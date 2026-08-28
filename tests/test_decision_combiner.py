"""Tests for the Decision Combiner (src/decision_combiner.py)."""

import decision_combiner as dc


def test_both_allow_executes():
    result = dc.combine("ALLOW", "ALLOW")
    assert result["final_decision"] == dc.EXECUTE


def test_detection_allow_mandate_block():
    result = dc.combine("ALLOW", "BLOCK")
    assert result["final_decision"] == dc.BLOCK


def test_detection_block_mandate_allow():
    result = dc.combine("BLOCK", "ALLOW")
    assert result["final_decision"] == dc.BLOCK


def test_both_block_blocks():
    result = dc.combine("BLOCK", "BLOCK")
    assert result["final_decision"] == dc.BLOCK


def test_mandate_requires_approval_holds_execution():
    result = dc.combine("ALLOW", "REQUIRES_APPROVAL")
    assert result["final_decision"] == dc.NO_EXECUTION


def test_detection_flag_holds_execution_even_if_mandate_allows():
    result = dc.combine("FLAG", "ALLOW")
    assert result["final_decision"] == dc.NO_EXECUTION


def test_fail_closed_unrecognized_detection():
    result = dc.combine("", "ALLOW")
    assert result["final_decision"] == dc.NO_EXECUTION


def test_fail_closed_unrecognized_mandate():
    result = dc.combine("ALLOW", "")
    assert result["final_decision"] == dc.NO_EXECUTION


def test_fail_closed_unknown_string():
    result = dc.combine("ALLOW", "MAYBE")
    assert result["final_decision"] == dc.NO_EXECUTION
