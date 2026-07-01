"""
Business Transaction model.

Canonical root object representing an execution request.
"""

from dataclasses import dataclass
from datetime import datetime

from .authority import Authority
from .authorization import Authorization
from .intent import Intent
from .policy_reference import PolicyReference


@dataclass(frozen=True, slots=True)
class BusinessTransaction:
    """
    Canonical execution request.

    This object establishes the execution trust chain.
    """

    business_transaction_id: str

    authority: Authority

    authorization: Authorization

    intent: Intent

    policy_reference: PolicyReference

    created_at: datetime

    version: str = "1.0"