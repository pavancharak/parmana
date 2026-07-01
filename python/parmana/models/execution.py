"""
Parmana Execution Model.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from .policy import PolicyReference


@dataclass(frozen=True)
class Decision:
    """
    Runtime policy decision.
    """

    decision_id: str

    intent_id: str

    policy: PolicyReference

    signals: dict

    outcome: str

    reason: str

    evaluated_at: datetime


@dataclass(frozen=True)
class Execution:
    """
    Execution performed by the Runtime.
    """

    execution_id: str

    business_transaction_id: str

    decision: Decision

    status: str

    mode: str

    started_at: datetime