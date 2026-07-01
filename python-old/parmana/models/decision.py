"""
Decision model.

Immutable result produced by deterministic policy evaluation.
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any

from .policy_reference import PolicyReference


class DecisionOutcome(str, Enum):
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


@dataclass(frozen=True, slots=True)
class Decision:
    """
    Immutable policy evaluation result.
    """

    decision_id: str

    intent_id: str

    policy: PolicyReference

    signals: dict[str, Any] = field(default_factory=dict)

    outcome: DecisionOutcome = DecisionOutcome.APPROVED

    reason: str | None = None

    evaluated_at: datetime = field(default_factory=datetime.utcnow)